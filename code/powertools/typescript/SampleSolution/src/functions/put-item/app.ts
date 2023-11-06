import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

const logger = new Logger();
const metrics = new Metrics({
  namespace: 'SampleApp',
  serviceName: 'Items',
});
const tracer = new Tracer();

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    let response: APIGatewayProxyResult;
    
    const singleMetric = metrics.singleMetric();
    // This metric will have the "FunctionContext" dimension, and no "metricUnit" dimension:
    singleMetric.addDimension('FunctionContext', '$LATEST');
    singleMetric.addMetric('TotalExecutions', MetricUnits.Count, 1);

    // you can copy and paste this line anywhere in the code to create a log line
    let location = event.requestContext.identity.sourceIp;
    let body = JSON.parse(event.body)

    logger.appendKeys({
       AdditionalInfo: {
         RequestLocation: location,
         ItemID: body.id,
       }
    });
    
    logger.debug("ip address successfuly captured"); //this log entry will have additional info

     // ColdStart is an automatic metric that Lambda Powertools creates, you can create more metrics
    metrics.captureColdStartMetric();


    // You need to take the segment automatically created by Lambda and pass it to Tracer
    const segment = tracer.getSegment();
    const handlerSegment = segment.addNewSubsegment(`## ${process.env._HANDLER}`);

    
    try {
        
        tracer.setSegment(handlerSegment);

        const item = await putItem(event)
        
        metrics.addMetric("SuccessfulPutItem", MetricUnits.Count, 1);
        metrics.addMetadata("request_location", location);

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "Item added successfuly"
        }

    } catch (err) {
        let error_message = `Error getting dynamodb items: ${err}`
        // error log
        logger.error(error_message);
        metrics.addMetric("FailedPutItem", MetricUnits.Count, 1);
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
