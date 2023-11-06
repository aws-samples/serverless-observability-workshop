import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const logger = new Logger();
const tracer = new Tracer();

export const lambdaHandler = async (event: APIGatewayProxyEvent ): Promise<APIGatewayProxyResult> => {

    let response: APIGatewayProxyResult;

    let location = event.requestContext.identity.sourceIp
    // you can copy and paste this line anywhere in the code to create a log line
    logger.info("Getting ip address from external service");
    logger.info("Location: " + location);
    
    tracer.putAnnotation("Location", location);
    tracer.putMetadata('Location', location);
    
    
    // You need to take the segment automatically created by Lambda and pass it to Tracer
    const segment = tracer.getSegment();
    let subsegment;
    //create a subsegment with name GetCAllingIP
    subsegment = segment.addNewSubsegment('GetCallingIP');
    tracer.setSegment(subsegment);
    //add the IP as a metadata to the newly created subsegment
    tracer.putMetadata('Location', location);
   

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
        // error log
        logger.error(error_message);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: error_message,
            }),
        };
    } finally {
        subsegment.close();
        tracer.setSegment(segment);
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
