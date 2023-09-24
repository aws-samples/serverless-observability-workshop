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

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class PostItemHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Logger logger = LogManager.getLogger(PostItemHandler.class);

    private final DynamoDbAsyncClient dynamoDbClient;

    public PostItemHandler() {
        dynamoDbClient = DynamoDbAsyncClient
                .builder()
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
                .httpClientBuilder(AwsCrtAsyncHttpClient.builder())
                .build();
    }

    @Logging(logEvent = true)
    @Override 
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            logger.info("Received request");
            Item item = JSON.std.beanFrom(Item.class, input.getBody());
            
            LoggingUtils.appendKey("Item Name: ", item.getName());
            
            Map<String, String> additionalInfo = new HashMap<>();
            additionalInfo.put("Id", String.valueOf(item.getId()));
            additionalInfo.put("Name", item.getName());
            LoggingUtils.appendKeys(additionalInfo);
            logger.info("Request Details");

            createItem(item);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Created item: " + JSON.std.asString(item));
        } catch (Exception e) {
            logger.error("Error while processing the request {}", e.getMessage());
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    private void createItem(Item item) {
        PutItemRequest putItemRequest = PutItemRequest.builder().item(
                Map.of("Id", AttributeValue.fromN(String.valueOf(item.getId())),
                        "itemName", AttributeValue.fromS(item.getName())))
                .tableName("SampleAppItem")
                .build();

        try {
            dynamoDbClient.putItem(putItemRequest).get();
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Exception:" + e.getMessage());
            throw new RuntimeException("Error creating Put Item request - " + e.getMessage());
        }
    }

}
