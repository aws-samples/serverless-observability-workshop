const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const { logger_setup } = require('../lib/logging/logger')

exports.putItemHandler = async (event, context) => {
    try {
        if (event.httpMethod !== 'POST') {
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
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
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