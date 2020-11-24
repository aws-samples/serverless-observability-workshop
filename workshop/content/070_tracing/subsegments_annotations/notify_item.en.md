---
title: "Notify New Item Function"
weight: 76
---

### Modify the application

Go back you your **Cloud9** environment and open your app workspace at ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modify the Notify New Item Function

1. Lambda doesn't allow us to add custom annotations and metadata to its root segment, so we first need to create our custom subsegment by updating our handler.

1. Edit the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js*** file to add an initial subsegment called `## Handler` using the `AWSXRay.captureAsyncFunc()` method on the entire handler method and closing the `subsegment` inside a new `finally` clause in our `try/catch`.

    ```javascript

    exports.notifiyNewItemHandler = async (event, context) => {
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

1. Next, we are ready to add our annotations in case of successful and failed executions to our given Item ID. Inside your `handler`, find and add in the end of your `try` and beginning of your `catch` statements the annotations for `ItemID` and `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Next, let's modify the `getItem()` method to receive the `subsegment` as a parameter and create an additional subsegment to capture any business logic inside this method.

    ```javascript
    const getItem = async (record, segment) => {
        return AWSXRay.captureAsyncFunc('## subscribeSNSNewItem', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```


1. Finally, modify the `handler` method to pass the subsegment to the `getItem()` method.
   
    ```javascript
    response = await getItem(record, subsegment)
    ```

1. Save your changes to the ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js*** file.

**Your entire file should look like the code below:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

exports.notifiyNewItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            const record = JSON.parse(event.Records[0].Sns.Message)
            response = await getItem(record, subsegment)
            //Tracing
            //subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            //subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'FAILED')
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, AWSXRay.getSegment());
}


const getItem = async (record, segment) => {
    return AWSXRay.captureAsyncFunc('## subscribeSNSNewItem', async (subsegment) => {
        let response
        try {
            response = JSON.stringify(record)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```