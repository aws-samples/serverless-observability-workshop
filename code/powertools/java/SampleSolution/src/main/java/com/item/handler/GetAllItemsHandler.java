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
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import software.amazon.lambda.powertools.logging.Logging;
import software.amazon.lambda.powertools.metrics.Metrics;
import software.amazon.cloudwatchlogs.emf.logger.MetricsLogger;
import software.amazon.cloudwatchlogs.emf.model.DimensionSet;
import software.amazon.cloudwatchlogs.emf.model.Unit;
import software.amazon.lambda.powertools.metrics.MetricsUtils;
import software.amazon.lambda.powertools.tracing.Tracing;

import static software.amazon.lambda.powertools.metrics.MetricsUtils.withSingleMetric;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

public class GetAllItemsHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private static final Logger logger = LogManager.getLogger(GetAllItemsHandler.class);
    MetricsLogger metricsLogger = MetricsUtils.metricsLogger();

    private final DynamoDbAsyncClient dynamoDbClient;
    String tableName = System.getenv("SAMPLE_APP_TABLE");

    public GetAllItemsHandler() {
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
            List<Item> items = getAllItems();

            withSingleMetric("SuccessfulGetAllItems", 1, Unit.COUNT, "SampleApp", (metric) -> {
                metric.setDimensions(DimensionSet.of("Service", "Items"));
            });
            
            //metricsLogger.putMetric("SuccessfulGetAllItems", 1, Unit.COUNT);
            metricsLogger.putMetadata("correlation_id", input.getRequestContext().getRequestId());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Received items: " + JSON.std.asString(items));
        } catch (Exception e) {
            logger.error("Error while processing the request: " +  e.getMessage());
            metricsLogger.putMetric("FailedGetAllItems", 1, Unit.COUNT);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    @Tracing
    private List<Item> getAllItems() {

        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();

        List<Item> items = new ArrayList<>();
        try {
            ScanResponse result = dynamoDbClient.scan(scanRequest).get();
            items = result.items().stream()
                    .map(item -> new Item(Integer.valueOf(item.get("Id").n()), item.get("itemName").s()))
                    .collect(Collectors.toList());

        } catch (InterruptedException | ExecutionException e) {
            logger.error("Exception: " +  e.getMessage());
            throw new RuntimeException("Error creating Get All Items request - " + e.getMessage());
        }

        return items;
    }

}
