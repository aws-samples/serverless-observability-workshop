import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(client);

const logger = new Logger();


export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

    let id;
    let response: APIGatewayProxyResult;

    id = event.pathParameters.id;
    const item = await getItemById(id);

    let location = event.requestContext.identity.sourceIp
    // you can copy and paste this line anywhere in the code to create a log line
    logger.info("Getting ip address from external service");
    logger.info("Location: " + location);


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
        // error log
        logger.error(error_message);
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