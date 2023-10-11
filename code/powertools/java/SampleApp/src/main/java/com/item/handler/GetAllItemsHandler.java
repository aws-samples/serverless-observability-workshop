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
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

public class GetAllItemsHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

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

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            System.out.println("Received request: " + JSON.std.asString(input));
            List<Item> items = getAllItems();

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Received items: " + JSON.std.asString(items));
        } catch (Exception e) {
            System.out.println("Error while processing the request: " +  e.getMessage());
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    private List<Item> getAllItems() {

        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();

        List<Item> items = new ArrayList<>();
        try {
            ScanResponse result = dynamoDbClient.scan(scanRequest).get();
            items = result.items().stream()
                    .map(item -> new Item(Integer.valueOf(item.get("Id").n()), item.get("itemName").s()))
                    .collect(Collectors.toList());

        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Exception: " +  e.getMessage());
            throw new RuntimeException("Error creating Get All Items request - " + e.getMessage());
        }

        return items;
    }

}
