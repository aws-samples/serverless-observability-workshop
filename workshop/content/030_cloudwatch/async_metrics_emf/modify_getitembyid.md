+++
title = "Modify the GetItemByID Function"
weight = 14
+++

In this step, we are going to define a couple of metrics that we want to capture amongst our three core services, and will instrument the `logMetricEMF()` method to embed such custom metrics alongside detailed log event data and push them asynchronously to CloudWatch Logs. With this setup CloudWatch will automatically extract the custom metrics without the need of separate components to deploy and maintain.

### Defining Metrics

Let's define the following Business & Operational metrics:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetItem`
- `FailedGetItem`

### Modifying the Get Item By ID Function

#### Importing Dependencies

1. Open the Lambda function located on ***/serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** and start by importing the required `Unit` and `logMetricEMF` dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

    ```javascript

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { Unit } = require("aws-embedded-metrics");
    const { logMetricEMF } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Adding PutMetric 

1. Now, inside the `getByIdHandler()` we are going to test whether it's the first execution of a given Lambda container and label it as `Cold Start`, also pushing this information as a CloudWatch Metric using our `logMetricEMF()` method. Add and `if` statement checking whether the `_cold_start` variable is `true` or `false` right after the beginning of the `try` block.

    ```javascript
    exports.getByIdHandler = async (event, context) => {
        let response, id
        try {
            if (_cold_start) {
                //Metrics
                await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
                _cold_start = false
            }
    ```

1. Now, we are going to capture metrics for `UnsupportedHTTPMethod`, instrumenting the `putMetric()` method call if our `if (event.httpMethod !== 'GET')` evaluates true.

    ```javascript
        if (event.httpMethod !== 'GET') {
            await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
            throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
        }

    ```

1. Next, we are ready to add our business metrics for successful and failed item list retrievals. Still inside your `getByIdHandler()`, find and add in the end of your `try` and beginning of your `catch` blocks the metrics for `SuccessfulGetItem` and `FailedGetItem`:

    ```javascript
        try{
            //After Successful Response Composition
            //Metrics
            await logMetricEMF(name = 'SuccessfulGetItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
        } catch (err) {
            //After Exception Handling
            //Metrics
            await logMetricEMF(name = 'FailedGetItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
        }
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** file.

**Your getByIdHandler method should look like the one below**

{{% expand "Full getByIdHandler method (expand for code)" %}}
```javascript
exports.getByIdHandler = async (event, context) => {
    let response, id
    try {
        if (_cold_start) {
            //Metrics
            await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
        if (event.httpMethod !== 'GET') {
            await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
            throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
        }

        id = event.pathParameters.id
        const item = await getItemById(id)
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(item)
        }
        //Metrics
        await logMetricEMF(name = 'SuccessfulGetItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
        //Metrics
        await logMetricEMF(name = 'FailedGetItem', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
    }
        
    return response
}
```
    {{% /expand %}}
