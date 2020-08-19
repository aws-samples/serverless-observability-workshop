const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { MetricUnit } = require('../lib/helper/models')
const { logger_setup, putMetric, logMetric } = require('../lib/logging/logger')

let _cold_start = true

exports.putItemHandler = async (event, context) => {
    try {
        if (_cold_start) {
            //Metrics
            await putMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
        if (event.httpMethod !== 'POST') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

        const item = await putItem(event)

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(item)
        }
        //Metrics
        await putMetric(name = 'SuccessfullPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
        //Metrics
        await putMetric(name = 'FailedPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
    }
    return response
}

const putItem = async (event) => {
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

    } catch (err) {
        throw err
    }
    return response
}