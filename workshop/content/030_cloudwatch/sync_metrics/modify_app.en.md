+++
title = "Modifying the Application Code"
weight = 11
+++

In this step, we are going to define a couple of metrics that we want to capture amongst our three core services, and will instrument the `putMetric()` method to push them synchronously to CloudWatch Metrics.

### Defining Metrics

Let's define the following Business & Operational metrics:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulPutItem`
- `FailedPutItem`

### Modifying the Put Item Function

#### Importing Dependencies

1. Open the Lambda function located on ***/serverless-observability-workshop/code/sample-app/src/handlers/put-item.js*** and start by importing the required `MetricUnit` and `putMetric` dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { putMetric } = require('../lib/logging/logger')

    let _cold_start = true
    ```

    #### Adding PutMetric

1. Now, inside the `putItemHandler()` we are going to test whether it's the first execution of a given Lambda container and label it as `Cold Start`, also pushing this information as a CloudWatch Metric using our `putMetric()` method. Add and `if` statement checking whether the `_cold_start` variable is `true` or `false` right after the beginning of the `try` block.

    ```javascript
    exports.putItemHandler = async (event, context) => {
        let response
        try {
            if (_cold_start) {
                //Metrics
                await putMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
                _cold_start = false
            }
    ```

1. Now, we are going to capture metrics for `UnsupportedHTTPMethod`, instrumenting the `putMetric()` method call if our `if (event.httpMethod !== 'POST')` evaluates true.

    ```javascript
        if (event.httpMethod !== 'POST') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

    ```

1. Next, we are ready to add our business metrics for successful and failed item insertions. Still inside your `putItemHandler()`, find and add in the end of your `try` and beginning of your `catch` blocks the metrics for `SuccessfulPutItem` and `FailedPutItem`:

    ```javascript
        try{
            //After Sucessful Response Composition
            //Metrics
            await putMetric(name = 'SuccessfulPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
        } catch (err) {
            //After Exception Handling
            //Metrics
            await putMetric(name = 'FailedPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
        }
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app/src/handlers/put-item.js*** file.

    **Your putItemHandler method should look like the one below**

    {{% expand "Full putItemHandler method (expand for code)" %}}
  ```javascript
    exports.putItemHandler = async (event, context) => {
      let response
      try {
          if (_cold_start) {
              //Metrics
              await putMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
              _cold_start = false
          }
          if (event.httpMethod !== 'POST') {
              await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
              throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
          }

          const item = await putItem(event)
          response = {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
            body: JSON.stringify(item)
          }
          //Metrics
          await putMetric(name = 'SuccessfulPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
      } catch (err) {
          response = {
              statusCode: 500,
              headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
          }
          //Metrics
          await putMetric(name = 'FailedPutItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
      }
      return response
  }
  ```
    {{% /expand %}}

### Deploy the application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```
