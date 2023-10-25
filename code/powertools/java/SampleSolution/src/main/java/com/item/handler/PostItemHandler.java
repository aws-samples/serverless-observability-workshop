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
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.lambda.powertools.logging.Logging;
import software.amazon.lambda.powertools.logging.LoggingUtils;
import software.amazon.lambda.powertools.metrics.Metrics;
import software.amazon.cloudwatchlogs.emf.logger.MetricsLogger;
import software.amazon.cloudwatchlogs.emf.model.DimensionSet;
import software.amazon.cloudwatchlogs.emf.model.Unit;
import software.amazon.lambda.powertools.metrics.MetricsUtils;
import software.amazon.lambda.powertools.tracing.Tracing;
import software.amazon.lambda.powertools.tracing.TracingUtils;

import static software.amazon.lambda.powertools.metrics.MetricsUtils.withSingleMetric;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class PostItemHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private static final Logger logger = LogManager.getLogger(PostItemHandler.class);
    MetricsLogger metricsLogger = MetricsUtils.metricsLogger();

    private final DynamoDbAsyncClient dynamoDbClient;
    String tableName = System.getenv("SAMPLE_APP_TABLE");

    public PostItemHandler() {
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

            logger.info("Received request");
            withSingleMetric("TotalExecutions", 1, Unit.COUNT, "SampleApp", (metric) -> {
                metric.setDimensions(DimensionSet.of("FunctionContext", "$LATEST"));
            });

            Item item = JSON.std.beanFrom(Item.class, input.getBody());
            
            LoggingUtils.appendKey("Item Name: ", item.getName());
            
            Map<String, String> additionalInfo = new HashMap<>();
            additionalInfo.put("Id", String.valueOf(item.getId()));
            additionalInfo.put("Name", item.getName());
            LoggingUtils.appendKeys(additionalInfo);
            logger.info("Request Details");

            createItem(item);

            metricsLogger.putDimensions(DimensionSet.of("Service", "Items"));
            metricsLogger.putMetric("SuccessfulPutItem", 1, Unit.COUNT);

            metricsLogger.putMetadata("correlation_id", input.getRequestContext().getRequestId());

            TracingUtils.putAnnotation("Item Id", String.valueOf(item.getId()));
            TracingUtils.putMetadata("Item Name", item.getName());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Created item: " + JSON.std.asString(item));
        } catch (Exception e) {
            logger.error("Error while processing the request {}", e.getMessage());
            metricsLogger.putMetric("FailedPutItem", 1, Unit.COUNT);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    @Tracing
    private void createItem(Item item) {
        PutItemRequest putItemRequest = PutItemRequest.builder().item(
                Map.of("Id", AttributeValue.fromN(String.valueOf(item.getId())),
                        "itemName", AttributeValue.fromS(item.getName())))
                .tableName(tableName)
                .build();

        try {
            dynamoDbClient.putItem(putItemRequest).get();
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Exception:" + e.getMessage());
            throw new RuntimeException("Error creating Put Item request - " + e.getMessage());
        }
    }

}
