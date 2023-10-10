import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(client);


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    let response: APIGatewayProxyResult;

    
    try {
        

        const items = await getAllItems();
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
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

const getAllItems = async () => {
    let response
    try {
        var params = {
            TableName: process.env.SAMPLE_TABLE,
        }
        response = await ddbDocClient.scan(params);
    } catch (err) {
        throw err
    }
    return response
}
