const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetric } = require('../lib/logging/logger')

let _cold_start = true
exports.getByIdHandler = async (event, context) => {
  let response
  try {
    if (_cold_start) {
      //Metrics
      await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
      _cold_start = false
    }
    if (event.httpMethod !== 'GET') {
      await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }

    id = event.pathParameters.id
    const item = await getItemById(id)

    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(item)
    }
    //Metrics
    await logMetric(name = 'SuccessfullGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
  } catch (err) {
    response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(err)
    }
    //Metrics
    await logMetric(name = 'FailedGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
  }
  return response
}


const getItemById = async (id) => {
  let response
  try {
    var params = {
      TableName: process.env.SAMPLE_TABLE,
      Key: { id: id }
    }

    response = await docClient.get(params).promise()
  } catch (err) {
    throw err
  }
  return response
}