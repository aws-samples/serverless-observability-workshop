import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let response: APIGatewayProxyResult;

    try {
        

        const item = await putItem(event)

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "Item adicionado com sucesso"
        }
    } catch (err) {
        let error_message = `Error getting dynamodb items: ${err}`

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

const putItem = async (event) => {
    let response
    try {
        const body = JSON.parse(event.body)
        const id = body.Id.toString()
        const name = body.Name

        var params = {
            TableName: process.env.SAMPLE_TABLE,
            Item: { id: id, name: name }
        }

        response = await ddbDocClient.put(params)

    } catch (err) {
        throw err
    }
    return response
}
