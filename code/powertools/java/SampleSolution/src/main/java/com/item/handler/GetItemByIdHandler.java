package com.item.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.jr.ob.JSON;
import com.item.entity.Item;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.SdkSystemSetting;
import software.amazon.awssdk.http.crt.AwsCrtAsyncHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class GetItemByIdHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final Logger logger = LoggerFactory.getLogger(GetItemByIdHandler.class);
    private final DynamoDbAsyncClient dynamoDbClient;

    public GetItemByIdHandler() {
        dynamoDbClient = DynamoDbAsyncClient
                .builder()
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .region(Region.of(System.getenv(SdkSystemSetting.AWS_REGION.environmentVariable())))
                .httpClientBuilder(AwsCrtAsyncHttpClient.builder())
                .build();
    }

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            logger.info("Received request: {}", JSON.std.asString(input));
            int id = Integer.valueOf(input.getPathParameters().get("id"));
            logger.info("Received request for id: {}", id);

            Item item = getItemById(id);
            if (item == null) {
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(404)
                        .withBody("No item found with id: " + id);
            }
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Received item: " + JSON.std.asString(item));
        } catch (Exception e) {
            logger.error("Error while processing the request", e);
            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    private Item getItemById(int id) {

        GetItemRequest getItemRequest = GetItemRequest.builder().tableName("SampleAppItem")
                .key(Map.of("Id", AttributeValue.fromN(String.valueOf(id)))).build();

        Item item = null;
        try {
            GetItemResponse result = dynamoDbClient.getItem(getItemRequest).get();
            logger.info("DDB Response: {}", result.item());
            if (result.hasItem()) {
                item = new Item(Integer.valueOf(result.item().get("Id").n()), result.item().get("itemName").s());
            }
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Exception:", e.getMessage());
            throw new RuntimeException("Error creating Get All Items request - " + e.getMessage());
        }

        return item;
    }

}
