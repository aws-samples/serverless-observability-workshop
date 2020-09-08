const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
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


const getAllItems = async () => {
    let response
    try {
        var params = {
            TableName: process.env.SAMPLE_TABLE
        }
        response = await docClient.scan(params).promise()
    } catch (err) {
        throw err
    }
    return response
}