---
title: "Función para obtener todos los ítems"
weight: 77
---

### Modificación de la aplicación 

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo  ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modificar la función para obtener todos los ítems

1. Lambda no nos permite añadir anotaciones y metadatos personalizados a su segmento raíz, por lo que primero necesitamos crear nuestro subsegmento personalizado actualizando nuestro gestor.

1. Edita el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** para añadir un subsegmento inicial llamado `## Handler` usando el método  `AWSXRay.captureAsyncFunc()` en todo el método handler y cerrando el `subsegmento` dentro de una nueva cláusula  `finally` en el bloque `try/catch`.

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

1. A continuación, estamos listos para añadir nuestras anotaciones en caso de ejecuciones exitosas o fallidas a nuestro ID del ítem. Dentro del `handler`, encuentra y añade al final del `try` y al comienzo del `catch` las anotaciones para `ItemsCount` y `Status`:

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

1. Ahora, modifiquemos el método `getAllItems()` para recibir también el `subsegmento` como parámetro y creemos un subsegmento adicional para capturar cualquier lógica empresarial dentro de este método. También añadiremos la carga útil del mensaje como metadatos.

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

1. Por último, modifica el método `handler` para pasar el subsegmento al método `getAllItems()`.
   
    ```javascript
    const items = await getAllItems(subsegment)
    ```

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**El archivo completo debería verse como el que está a continuación:**

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