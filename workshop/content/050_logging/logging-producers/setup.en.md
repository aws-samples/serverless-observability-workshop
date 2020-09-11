+++
title = "Analyzing Logger Library"
weight = 52
+++

To help us print our logs in a strutured way to CloudWatch Logs we will be using the [lambda-log](https://www.npmjs.com/package/lambda-log) NPM module, which already logs our log entries as a structured JSON and also allow us to define additional metadata and attributes to enrich our logs for further analysis and correlations. To ease some of the complexity of setting up the module in our code, you'll find a lib folder under ***/serverless-observability-workshop/code/sample-app/src/lib*** containing some helper functions ready to be imported across our Lambda functions. 

{{% notice tip %}}
Spare a couple of minutes to understand the methods created the ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** file.
{{% /notice %}}

### Logger Library

Let us now navigate through the ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** file containing the `logger_setup()` method to help us initiate the logging lib inside our Lambda Functions.

The way its currently setup, will be additionally adding a timestamp and the `X-Ray Tracing IDs` for both root and parent segments, in case `Active Tracing` is enabled in our code. This might come in handy if we ever need to query for a specific transaction that failed throughout the microservices chain, being able to query by its root trace ID. 

Depending on whether we enable or not `Debug` levels on our `template.yaml` SAM template, we can toggle on/off `log.debug()` entries to be logged to CloudWatch Logs.
 
```javascript
const log = require('lambda-log')
/**
 * Prepares logger class to be used across methods.
 * 
 * This setup evaluates the need of enabling debug entries 
 * and also adds a timestamp to all log entries as custom metadata. 
 * 
 * @property    {String}    ENABLE_DEBUG    Toggles debug mode on/off for printing debug entires on CloudWatch Logs. This variable can be defined in the SAM template.
 *  
 * @returns     {LambdaLog} Logger class.
 */
exports.logger_setup = () => {
    const tracingInfo = process.env._X_AMZN_TRACE_ID || '';
    const TRACE_ID_REGEX = /^Root=(.+);Parent=(.+);/;
    const matches = tracingInfo.match(TRACE_ID_REGEX) || ['', '', ''];
    
    log.options.debug = process.env.ENABLE_DEBUG !== undefined ? process.env.ENABLE_DEBUG : false
    log.options.dynamicMeta = message => {
        return {
            timestamp: new Date().toISOString(),
            'X-Amzn-Trace-Id': tracingInfo,
            'X-Amzn-Trace-Id-Root': matches[1],
            'X-Amzn-Trace-Id-Parent': matches[2]
        }
    }
    return log
}
```
