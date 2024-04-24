const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getByIdHandler = async (event, context) => {
  let response, id
  try {
    if (event.httpMethod !== 'GET') {
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