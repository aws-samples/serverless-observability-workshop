import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);


export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {


    let id;
    let response: APIGatewayProxyResult;

    id = event.pathParameters.id;
    const item = await getItemById(id);


    try {

        const items = await getItemById(id);
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
    } catch (err) {
        let error_message = `Error getting dynamodb item ${id}: ${err}`

        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: error_message,
            }),
        };
    } finally {
        
    }

    return response;
};

const getItemById = async (id) => {
    let response
    try {
      var params = {
        TableName: process.env.SAMPLE_TABLE,
        Key: { id: id }
      }
  
      response = await ddbDocClient.get(params);
    } catch (err) {
      throw err
    }
    return response
  }
