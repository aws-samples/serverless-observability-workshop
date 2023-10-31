package com.item.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import software.amazon.cloudwatchlogs.emf.logger.MetricsLogger;
import software.amazon.cloudwatchlogs.emf.model.Unit;
import software.amazon.lambda.powertools.logging.Logging;
import software.amazon.lambda.powertools.metrics.Metrics;
import software.amazon.lambda.powertools.metrics.MetricsUtils;
import software.amazon.lambda.powertools.tracing.Tracing;
import software.amazon.lambda.powertools.tracing.TracingUtils;


public class HelloTracesWorldHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    
    private static final Logger logger = LogManager.getLogger(HelloTracesWorldHandler.class);
    MetricsLogger metricsLogger = MetricsUtils.metricsLogger();

    @Logging(logEvent = true)
    @Tracing
    @Metrics(namespace = "Hello", service = "Hello", captureColdStart = true)
    @Override
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {

        try {

            logger.info("Hello Traces");

            metricsLogger.putMetric("Hello", 1, Unit.COUNT);

            doSomething();

            TracingUtils.putAnnotation("TraceAnnotation", "Trace Annotation");
            TracingUtils.putMetadata("TraceMetadata", "Trace Metadata");

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withBody("Hello from Traces");
        } catch (Exception e) {
            logger.error("Error while processing the request: " +  e.getMessage());

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(400)
                    .withBody("Error processing the request");
        }

    }

    @Tracing
    private void doSomething() {
        logger.info("Doing something");
        metricsLogger.putMetric("Doing something", 1, Unit.COUNT);
        TracingUtils.putAnnotation("Doing something", "Doing something");
        TracingUtils.putMetadata("Doing something", "Doing something");
        logger.info("Done doing something");

    }

}
