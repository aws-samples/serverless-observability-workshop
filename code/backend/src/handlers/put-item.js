const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();
const { Unit } = require("aws-embedded-metrics")
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetric, logMetricEMF } = require('../lib/logging/logger')
let log

let _cold_start = true

exports.putItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        log = logger_setup()
        let response

        log.info(event)
        log.info(context)

        try {
            if (_cold_start) {
                //Metrics
                await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
                _cold_start = false
            }
            if (event.httpMethod !== 'POST') {
                log.error({ "operation": "put-item", 'method': 'putItemHandler', "details": `PutItem only accept GET method, you tried: ${event.httpMethod}` })
                await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
                throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
            }

            const item = await putItem(event, subsegment)
            await publishSns(item, subsegment)

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(item)
            }
            //Metrics
            await logMetricEMF(name = 'SuccessfulPutItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            //Tracing
            log.debug('Adding Item Creation annotation')
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            log.debug('Adding Item Creation annotation before raising error')
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'FAILED')
            //Logging
            log.error({ "operation": "put-item", 'method': 'putItemHandler', "details": err })

            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            }

            //Metrics
            await logMetricEMF(name = 'FailedPutItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
        } finally {
            subsegment.close()
        }
        log.info({ operation: 'put-item', 'method': 'putItemHandler', eventPath: event.path, statusCode: response.statusCode, body: JSON.parse(response.body) })
        return response

    }, AWSXRay.getSegment());
}

const putItem = async (event, segment) => {
    return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
        let response
        try {
            const body = JSON.parse(event.body)
            const id = body.id
            const name = body.name

            var params = {
                TableName: process.env.SAMPLE_TABLE,
                Item: { id: id, name: name }
            }

            response = await docClient.put(params).promise()

            //Logging
            log.info({ "operation": "put-item", 'method': 'putItem', "details": response })
            log.debug('Adding putItem operation result as tracing metadata')
            //Tracing
            subsegment.addMetadata('Item Payload', params)
        } catch (err) {
            log.error({ "operation": "put-item", 'method': 'putItem', "details": err })
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}

const publishSns = async (data, segment) => {
    return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
        let response
        try {
            const msg = {
                TopicArn: process.env.TOPIC_NAME,
                Message: JSON.stringify({
                    operation: "notify_new_item",
                    details: {
                        //id: data.Attributes.id,
                        //name: data.Attributes.FullName ? data.Attributes.FullName : "N/A"
                        id: 1,
                        name: "N/A"
                    }
                }),
                MessageAttributes: {
                    "Status": { "DataType": "String", "StringValue": "Success" }
                }
            }

            response = await sns.publish(msg).promise()

            //Logging
            log.info({ "operation": "put-item", 'method': 'publishSns', "details": response })
            log.debug('Adding SNS message payload as tracing metadata')
            //Tracing
            subsegment.addMetadata('Message Payload', msg)
        } catch (err) {
            log.error({ "operation": "put-item", 'method': 'publishSns', "details": err })
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}