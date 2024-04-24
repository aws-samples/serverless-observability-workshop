const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

exports.putItemHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

        const item = await putItem(event)
        await publishSns(item)

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


const publishSns = async (data) => {
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

    } catch (err) {
        throw err
    }
    return response
}