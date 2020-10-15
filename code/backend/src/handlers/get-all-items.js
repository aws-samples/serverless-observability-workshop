const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetricEMF } = require('../lib/logging/logger')
const { Unit } = require("aws-embedded-metrics");
let log

let _cold_start = true

exports.getAllItemsHandler = async (event, context) => {
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
            if (event.httpMethod !== 'GET') {
                log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
                await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
                throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
            }

            const items = await getAllItems(subsegment)
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(items)
            }
            //Metrics
            await logMetricEMF(name = 'SuccessfulGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
            //Tracing
            log.debug('Adding All Items Retrieval annotation')
            subsegment.addAnnotation('ItemsCount', items.Count)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            log.debug('Adding All Items Retrieval annotation before raising error')
            subsegment.addAnnotation('Status', 'FAILED')
            //Logging
            log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": err })

            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            }

            //Metrics
            await logMetricEMF(name = 'FailedGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
        } finally {
            subsegment.close()
        }
        log.info({ operation: 'get-all-items', 'method': 'getAllItemsHandler', eventPath: event.path, statusCode: response.statusCode, body: JSON.parse(response.body) })
        return response
    }, AWSXRay.getSegment());
}


const getAllItems = async (segment) => {
    return AWSXRay.captureAsyncFunc('## getAllItemsData', async (subsegment) => {
        let response
        try {
            var params = {
                TableName: process.env.SAMPLE_TABLE
            }
            response = await docClient.scan(params).promise()

            //Logging
            log.info({ "operation": "get-all-items", 'method': 'getAllItems', "details": response })
            log.debug('Adding getAllItemsData operation result as tracing metadata')
            //Tracing
            subsegment.addMetadata('items', response)
        } catch (err) {
            log.error({ "operation": "get-all-items", 'method': 'getAllItems', "details": err })
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}