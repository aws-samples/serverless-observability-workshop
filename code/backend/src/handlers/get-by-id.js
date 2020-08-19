const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetric } = require('../lib/logging/logger')
let log

let _cold_start = true

exports.getByIdHandler = async (event, context) => {
  return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
    log = logger_setup()
    let response, id

    log.info(event)
    log.info(context)

    try {
      if (_cold_start) {
        //Metrics
        await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
        _cold_start = false
      }
      if (event.httpMethod !== 'GET') {
        log.error({ "operation": "get-by-id", 'method': 'getByIdHandler', "details": `getById only accept GET method, you tried: ${event.httpMethod}` })
        await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
        throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
      }
      
      id = event.pathParameters.id
      const item = await getItemById(id, subsegment)

      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(item)
      }
      //Metrics
      await logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      //Tracing
      log.debug('Adding Item Retrieval annotation')
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'SUCCESS')
    } catch (err) {
      //Tracing
      log.debug('Adding Item Retrieval annotation before raising error')
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'FAILED')
      //Logging
      log.error({ "operation": "get-by-id", 'method': 'getByIdHandler', "details": err })

      response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(err)
      }

      //Metrics
      await logMetric(name = 'FailedGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
    } finally {
      subsegment.close()
    }
    log.info({ operation: 'get-by-id', 'method': 'getByIdHandler', eventPath: event.path, statusCode: response.statusCode, body: response.body })
    return response
  }, AWSXRay.getSegment());
}


const getItemById = async (id, segment) => {
  return AWSXRay.captureAsyncFunc('## getItemData', async (subsegment) => {
    let response
    try {
      var params = {
        TableName: process.env.SAMPLE_TABLE,
        Key: { id: id }
      }

      response = await docClient.get(params).promise()

      //Logging
      log.info({ "operation": "get-by-id", 'method': 'getItemById', "details": response })
      log.debug('Adding getItemById operation result as tracing metadata')
      //Tracing
      subsegment.addMetadata('Item', response)
    } catch (err) {
      log.error({ "operation": "get-by-id", 'method': 'getItemById', "details": err })
      throw err
    } finally {
      subsegment.close()
    }
    return response
  }, segment);
}