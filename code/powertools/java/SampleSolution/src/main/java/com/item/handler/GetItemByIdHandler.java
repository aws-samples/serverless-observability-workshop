package com.item.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.jr.ob.JSON;
import com.item.entity.Item;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.http.crt.AwsCrtAsyncHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import software.amazon.lambda.powertools.logging.Logging;
import software.amazon.lambda.powertools.logging.LoggingUtils;
import software.amazon.lambda.powertools.metrics.Metrics;
import software.amazon.cloudwatchlogs.emf.logger.MetricsLogger;
import software.amazon.cloudwatchlogs.emf.model.Unit;
import software.amazon.lambda.powertools.metrics.MetricsUtils;
import software.amazon.lambda.powertools.tracing.Tracing;
import software.amazon.lambda.powertools.tracing.TracingUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class GetItemByIdHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private static final Logger logger = LogManager.getLogger(GetItemByIdHandler.class);
    MetricsLogger metricsLogger = MetricsUtils.metricsLogger();

    private final DynamoDbAsyncClient dynamoDbClient;
    String tableName = System.getenv("SAMPLE_APP_TABLE");

    public GetItemByIdHandler() {
        dynamoDbClient = DynamoDbAsyncClient
                .builder()
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
                .httpClientBuilder(AwsCrtAsyncHttpClient.builder())
                .build();
    }

    @Logging(logEvent = true)
    @Metrics(namespace = "SampleApp", service = "Items", captureColdStart = true)
    @Tracing
    @Override 
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            logger.info("Received request: " + JSON.std.asString(input));
            
            int id = Integer.valueOf(input.getPathParameters().get("id"));
            Map<String, String> additionalInfo = new HashMap<>();
            additionalInfo.put("Id", String.valueOf(id));
            LoggingUtils.appendKeys(additionalInfo);
            logger.info("Request Details");

            metricsLogger.putMetadata("correlation_id", input.getRequestContext().getRequestId());

            Item item = getItemById(id);
            if (item == null) {
                metricsLogger.putMetric("ItemNotFound", 1, Unit.COUNT);
    
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(404)
                        .withBody("No item found with id: " + id);
            }

            metricsLogger.putMetric("SuccessfulGetItem", 1, Unit.COUNT);

            TracingUtils.putAnnotation("Item Id", String.valueOf(item.getId()));
            TracingUtils.putMetadata("Item Name", item.getName());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Received item: " + JSON.std.asString(item));
        } catch (Exception e) {
            logger.error("Error while processing the request: "+ e.getMessage());
            metricsLogger.putMetric("FailedGetItem", 1, Unit.COUNT);     

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    @Tracing
    private Item getItemById(int id) {

        GetItemRequest getItemRequest = GetItemRequest.builder().tableName(tableName)
                .key(Map.of("Id", AttributeValue.fromN(String.valueOf(id)))).build();

        Item item = null;
        try {
            GetItemResponse result = dynamoDbClient.getItem(getItemRequest).get();
            logger.info("DDB Response: " + result.item());
            if (result.hasItem()) {
                item = new Item(Integer.valueOf(result.item().get("Id").n()), result.item().get("itemName").s());
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Exception: "+ e.getMessage());
            throw new RuntimeException("Error creating Get All Items request - " + e.getMessage());
        }

        return item;
    }

}
