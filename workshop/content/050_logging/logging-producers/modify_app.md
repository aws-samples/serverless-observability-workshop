+++
title = "Modifying the Application Code"
weight = 53
+++

#### Importing Dependencies

1. Open the Lambda function located on ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** and start by importing the required dependencies in the beginning of the file and initializing a `log` variable to be used in our lambda executions:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { logger_setup } = require('../lib/logging/logger')
    let log
    ```

    #### Instrumenting Logs 

1. Now, inside the `getAllItemsHandler()` we are going to initialize our `log` variable and print both `event` and `context` objects for later analysis.

    ```javascript
    exports.getAllItemsHandler = async (event, context) => {
      log = logger_setup()
      let response

      log.info(event)
      log.info(context)
    ```

1. Still inside our `getAllItemsHandler()`, we are going to capture logs for `UnsupportedHTTPMethod`, instrumenting the `log.error()` method call if our `if (event.httpMethod !== 'GET')` evaluates true.

    ```javascript
    if (event.httpMethod !== 'GET') {
        // Logging
        log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. Next, we are ready to log `error` entries for item list retrievals and `info` entries for the final execution details. Still inside your `getAllItemsHandler()`, find and add in the beginning of your `catch` block and right before the `return` statement the `log.error()` and `log.info()` method calls, respectively:

    ```javascript
        try{
            //After Sucessful Response Composition
        } catch (err) {
            // Logging
            log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": err })
        }
    // Logging
    log.info({ operation: 'get-all-items', 'method': 'getAllItemsHandler', eventPath: event.path, statusCode: response.statusCode, body: JSON.parse(response.body) })
    return response
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** file.

    **Your getAllItemsHandler method should look like the one below**

    {{% expand "Full getAllItemsHandler method (expand for code)" %}}
  ```javascript
  exports.getAllItemsHandler = async (event, context) => {
      log = logger_setup()
      let response

      log.info(event)
      log.info(context)
      try {
          if (event.httpMethod !== 'GET') {
              // Logging
              log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
              throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
          }

          const items = await getAllItems()
          response = {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(items)
          }
      } catch (err) {
          // Logging
          log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": err })
          response = {
              statusCode: 500,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(err)
          }
      }
      // Logging
      log.info({ operation: 'get-all-items', 'method': 'getAllItemsHandler', eventPath: event.path, statusCode: response.statusCode, body: JSON.parse(response.body) })
      return response
  }
  ```
    {{% /expand %}}

### Deploy the application

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Test the `Get All Items` operation

```sh
curl -X GET $ApiUrl/items/ | jq
```
