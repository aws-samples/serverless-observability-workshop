import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(client);

const logger = new Logger();
const metrics = new Metrics();
const tracer = new Tracer();

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    /* This SampleAPP contains
    1 - Running logs
    2 - Working metrics
    3 - Working Tracer
    4 - Running DynamoDB search by item
    5 - You can create more segments and subsegments for Tracer
    6 - You can customize other items you want, such as the type of event and things like that
    */

    let response: APIGatewayProxyResult;

    // you can copy and paste this line anywhere in the code to create a log line
    logger.info("Create a log line");
    logger.info("Event received: " + JSON.stringify(event, null, 2));


     // ColdStart is an automatic metric that Lambda Powertools creates, you can create more metrics
    metrics.captureColdStartMetric();

    // This line creates metrics, put the metric you want in the part of the code you want
    // MetricsUnits is the type of metric, it can be Count, Bytes, Milliseconds, None, Percent, etc.
    metrics.addMetric("FirstMetric", MetricUnits.Count, 1);


    // You need to take the segment automatically created by Lambda and pass it to Tracer
    const segment = tracer.getSegment();
    const handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);

    
    try {
        
        tracer.setSegment(handlerSegment);

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
        // Close subsegments (the AWS Lambda one is closed automatically)
        handlerSegment.close(); // (## index.handler)

        // This line forces metrics to be sent to cloudwatch to process via EMF - Do not remove!!
        metrics.publishStoredMetrics();
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
