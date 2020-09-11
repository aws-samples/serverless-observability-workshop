+++
title = "Modifying the Application Code"
weight = 12
+++

In this step, we are going to define a couple of metrics that we want to capture amongst our three core services, and will instrument the `logMetric()` method to push them asynchronously to CloudWatch Metrics, having them first logged to CloudWatch Logs and then processed in background by the utility module we deployed in the previous step.

### Defining Metrics

Let's define the following Business & Operational metrics:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetItem`
- `FailedGetItem`

### Modifying the Get All Items Function

#### Importing Dependencies

1. Open the Lambda function located on ***/serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** and start by importing the required `MetricUnit` and `logMetric` dependencies in the beginning of the file and initializing a `_cold_start` variable to capture cold starts in our lambda executions:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { logMetric } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Adding LogMetric 

1. Now, inside the `getByIdHandler()` we are going to test whether it's the first execution of a given Lambda container and label it as `Cold Start`, also pushing this information as a CloudWatch Metric using our `logMetric()` method. Add and `if` statement checking whether the `_cold_start` variable is `true` or `false` right after the beginning of the `try` block.

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

1. Now, we are going to capture metrics for `UnsupportedHTTPMethod`, instrumenting the `logMetric()` method call if our `if (event.httpMethod !== 'GET')` evaluates true.

    ```javascript
    if (event.httpMethod !== 'GET') {
      await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. Next, we are ready to add our business metrics for successful and failed item retrievals by a given ID. Still inside your `getByIdHandler()`, find and add in the end of your `try` and beginning of your `catch` blocks the metrics for `SuccessfulGetItem` and `FailedGetItem`:

    ```javascript
    try{
      //After Sucessful Response Composition
      //Metrics
      await logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
    } catch (err) {
      //After Exception Handling
      //Metrics
      await logMetric(name = 'FailedGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
    }
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** file.

    **Your getByIdHandler method should look like the one below**

    {{% expand "Full getByIdHandler method (expand for code)" %}}

  ```javascript
    exports.getByIdHandler = async (event, context) => {
      let response
      try {
        if (_cold_start) {
          //Metrics
          await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
          _cold_start = false
        }
        if (event.httpMethod !== 'GET') {
          await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
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
        await logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      } catch (err) {
        response = {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(err)
        }
        //Metrics
        await logMetric(name = 'FailedGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      }
      return response
    }
  ```

    {{% /expand %}}


### Deploy the application

```sh
sam build && sam deploy
```

### Test the `Get Item By ID` operation

```sh
curl -X GET $ApiUrl/items/1 | jq
```
