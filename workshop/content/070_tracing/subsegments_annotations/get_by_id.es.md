---
title: "Función para obtener un ítem por ID"
weight: 78
---

### Modificación de la aplicación 

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo  ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modificar la función para obtener un ítem por ID

1. Lambda no nos permite añadir anotaciones y metadatos personalizados a su segmento raíz, por lo que primero necesitamos crear nuestro subsegmento personalizado actualizando nuestro gestor.

1. Edita el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js*** para añadir un subsegmento inicial llamado `## Handler` usando el método `AWSXRay.captureAsyncFunc()` en todo el método handler y cerrando el `subsegmento` dentro de una nueva cláusula `finally` en el bloque `try/catch`.

    ```javascript

    exports.getByIdHandler = async (event, context) => {
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
            subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Ahora, modifiquemos el método `getItemById()` para recibir también el `subsegmento` como parámetro y creemos un subsegmento adicional para capturar cualquier lógica empresarial dentro de este método. También añadiremos la carga útil del mensaje como metadatos.

    ```javascript
    const getItemById = async (id, segment) => {
        return AWSXRay.captureAsyncFunc('## getItemData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Item', response)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```


1. Por último, modifica el método `handler` para pasar el subsegmento al método `getItemById()`.
   
    ```javascript
    const item = await getItemById(id, subsegment)
    ```

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js***.

**El archivo completo debería verse como el que está a continuación:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getByIdHandler = async(event, context) => {
  return AWSXRay.captureAsyncFunc('## Handler', async(subsegment) => {
    let response, id
    try {
      if (event.httpMethod !== 'GET') {
        throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
      }

      id = event.pathParameters.id
      const item = await getItemById(id, subsegment)

      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(item)
      }
      //Tracing
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'SUCCESS')
    }
    catch (err) {

      response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(err)
      }
      //Tracing
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'FAILED')
    }
    finally {
      subsegment.close()
    }
    return response
  }, AWSXRay.getSegment());
}


const getItemById = async(id, segment) => {
  return AWSXRay.captureAsyncFunc('## getItemData', async(subsegment) => {
    let response
    try {
      var params = {
        TableName: process.env.SAMPLE_TABLE,
        Key: { id: id }
      }

      response = await docClient.get(params).promise()
      //Tracing
      subsegment.addMetadata('Item', response)
    }
    catch (err) {
      throw err
    }
    finally {
      subsegment.close()
    }
    return response
  }, segment);
}

```