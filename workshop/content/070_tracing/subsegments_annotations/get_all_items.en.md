---
title: "Get All Items Function"
weight: 77
---

### Modify the application

Go back you your **Cloud9** environment and open your app workspace at ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modify the Get All Items Function

1. Lambda doesn't allow us to add custom annotations and metadata to its root segment, so we first need to create our custom subsegment by updating our handler.

1. Edit the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** file to add an initial subsegment called `## Handler` using the `AWSXRay.captureAsyncFunc()` method on the entire handler method and closing the `subsegment` inside a new `finally` clause in our `try/catch`.

    ```javascript

    exports.getAllItemsHandler = async (event, context) => {
      return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
          // Initialization
          try{
            // Happy Path
          } catch(err) {
            // Exception Handling
          } finally {
              subsegment.close()
          }
          return response
      }, AWSXRay.getSegment());
    }
    ```

1. Next, we are ready to add our annotations in case of successful and failed executions to our given Item ID. Inside your `handler`, find and add in the end of your `try` and beginning of your `catch` statements the annotations for `ItemsCount` and `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('ItemsCount', items.Count)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Now, let's modify the `getAllItems()` method to also receive the `subsegment` as a parameter and create an additional subsegment to capture any business logic inside this method. We will be also adding the message payload as metadata.

    ```javascript
    const getAllItems = async (segment) => {
        return AWSXRay.captureAsyncFunc('## getAllItemsData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('items', response)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Finally, modify the `handler` method to pass the subsegment to the `getAllItems()` method.
   
    ```javascript
    const items = await getAllItems(subsegment)
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** file.

**Your entire file should look like the code below:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getAllItemsHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            if (event.httpMethod !== 'GET') {
                throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
            }

            const items = await getAllItems(subsegment)
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(items)
            }
            //Tracing
            subsegment.addAnnotation('ItemsCount', items.Count)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            }
        } finally {
            subsegment.close()
        }
        return response
    }, AWSXRay.getSegment());
}


const getAllItems = async (segment) => {
    return AWSXRay.captureAsyncFunc('## getAllItemsData', async (subsegment) => {
        let response
        try {
            var params = {
                TableName: process.env.SAMPLE_TABLE
            }
            response = await docClient.scan(params).promise()
            //Tracing
            subsegment.addMetadata('items', response)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```