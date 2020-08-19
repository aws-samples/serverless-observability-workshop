const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetric } = require('../lib/logging/logger')
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
                await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
                _cold_start = false
            }
            if (event.httpMethod !== 'POST') {
                log.error({ "operation": "put-item", 'method': 'putItemHandler', "details": `PutItem only accept GET method, you tried: ${event.httpMethod}` })
                await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
                throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
            }

            const item = await putItem(event, subsegment)

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(item)
            }
            //Metrics
            await logMetric(name = 'SuccessfulPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
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
            await logMetric(name = 'FailedPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
        } finally {
            subsegment.close()
        }
        log.info({ operation: 'put-item', 'method': 'putItemHandler', eventPath: event.path, statusCode: response.statusCode, body: response.body })
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