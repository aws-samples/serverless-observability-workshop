package com.item.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.jr.ob.JSON;
import com.item.entity.Item;

import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.http.crt.AwsCrtAsyncHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public class PostItemHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final DynamoDbAsyncClient dynamoDbClient;

    public PostItemHandler() {
        dynamoDbClient = DynamoDbAsyncClient
                .builder()
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
                .httpClientBuilder(AwsCrtAsyncHttpClient.builder())
                .build();
    }

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            System.out.println("Received request:" + JSON.std.asString(input));
            Item item = JSON.std.beanFrom(Item.class, input.getBody());
            createItem(item);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Created item: " + JSON.std.asString(item));
        } catch (Exception e) {
            System.out.println("Error while processing the request" + e.getMessage());
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
