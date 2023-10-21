package com.item.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import software.amazon.lambda.powertools.logging.Logging;
import software.amazon.lambda.powertools.metrics.Metrics;
import software.amazon.cloudwatchlogs.emf.logger.MetricsLogger;
import software.amazon.cloudwatchlogs.emf.model.DimensionSet;
import software.amazon.cloudwatchlogs.emf.model.Unit;
import software.amazon.lambda.powertools.metrics.MetricsUtils;
import software.amazon.lambda.powertools.tracing.Tracing;
import static software.amazon.lambda.powertools.metrics.MetricsUtils.withSingleMetric;


public class HelloMetricsWorldHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private static final Logger logger = LogManager.getLogger(HelloMetricsWorldHandler.class);
    MetricsLogger metricsLogger = MetricsUtils.metricsLogger();

    @Logging(logEvent = true)
    @Metrics(namespace = "SampleApp", service = "Items", captureColdStart = true)
    @Tracing
    @Override
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            logger.info("Hello Metrics");

            metricsLogger.putDimensions(DimensionSet.of("environment", "prod"));
            metricsLogger.putMetric("Hello", 1, Unit.COUNT);

            withSingleMetric("HelloSM", 1, Unit.COUNT, "SampleApp", (metric) -> {
                metric.setDimensions(DimensionSet.of("environment", "prod"));
            });

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Hello from Metrics");
        } catch (Exception e) {
            logger.error("Error while processing the request: " +  e.getMessage());
            metricsLogger.putMetric("Error", 1, Unit.COUNT);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

}
