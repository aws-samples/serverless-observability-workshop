---
title: "Función para adicionar ítem"
weight: 75
---

### Modificación de la aplicación 

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo  ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modificar la función para adicionar un nuevo ítem

1. Lambda no nos permite añadir anotaciones y metadatos personalizados a su segmento raíz, por lo que primero necesitamos crear nuestro subsegmento personalizado actualizando nuestro gestor.

1.  Edita el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js*** para añadir un subsegmento inicial llamado `## Handler` usando el método `AWSXRay.captureAsyncFunc()` en todo el método handler y cerrando el `subsegmento` dentro de una nueva cláusula `finally` en el bloque `try/catch`.

    ```javascript

    exports.putItemHandler = async (event, context) => {
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

1. A continuación, estamos listos para añadir nuestras anotaciones en caso de ejecuciones exitosas o fallidas a nuestro ID del ítem. Dentro del `handler`, encuentra y añade al final del `try` y al comienzo del `catch` las anotaciones para `ItemID` y `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Ahora, modifiquemos el método `putItem()` para recibir también el `subsegmento` como parámetro y creemos un subsegmento adicional para capturar cualquier lógica empresarial dentro de este método. También añadiremos la carga útil del mensaje como metadatos.

    ```javascript
    const putItem = async (event, segment) => {
        return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Item Payload', params)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```


1. Ahora, modifiquemos el método `publishSns()` para recibir también el `subsegmento` como parámetro y creemos un subsegmento adicional para capturar cualquier lógica empresarial dentro de este método. También añadiremos la carga útil del mensaje como metadatos.

    ```javascript
    const publishSns = async (data, segment) => {
        return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Message Payload', msg)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Por último, modifica el método `handler` para pasar el subsegmento a los métodos `putItem()` y  `publishSns()`.
   
    ```javascript
    const item = await putItem(event, subsegment)
    await publishSns(item, subsegment)
    ```

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js***.

**El archivo completo debería verse como el que está a continuación:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

exports.putItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            if (event.httpMethod !== 'POST') {
                throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
            }

            const item = await putItem(event, subsegment)
            await publishSns(item, subsegment)

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(item)
            }
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
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

const putItem = async (event, segment) => {
    return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
        let response
        try {
            const body = JSON.parse(event.body)
            const id = body.id
            const name = body.name

            var params = {
                TableName: process.env.SAMPLE_TABLE,
                Item: { id: id, name: name }
            }

            response = await docClient.put(params).promise()

            //Tracing
            subsegment.addMetadata('Item Payload', params)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}


const publishSns = async (data, segment) => {
    return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
        let response
        try {
            const msg = {
                TopicArn: process.env.TOPIC_NAME,
                Message: JSON.stringify({
                    operation: "notify_new_item",
                    details: {
                        //id: data.Attributes.id,
                        //name: data.Attributes.FullName ? data.Attributes.FullName : "N/A"
                        id: 1,
                        name: "N/A"
                    }
                }),
                MessageAttributes: {
                    "Status": { "DataType": "String", "StringValue": "Success" }
                }
            }

            response = await sns.publish(msg).promise()

            subsegment.addMetadata('Message Payload', msg)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```