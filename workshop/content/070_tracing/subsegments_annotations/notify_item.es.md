---
title: "Función para notificar un nuevo ítem"
weight: 76
---

### Modificación de la aplicación 

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo  ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modificar la función para notificar un nuevo ítem

1. Lambda no nos permite añadir anotaciones y metadatos personalizados a su segmento raíz, por lo que primero necesitamos crear nuestro subsegmento personalizado actualizando nuestro gestor.

1. Edita el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js*** para añadir un subsegmento inicial llamado `## Handler` usando el método `AWSXRay.captureAsyncFunc()` en todo el método handler y cerrando el `subsegmento` dentro de una nueva cláusula `finally` en el bloque `try/catch`.

    ```javascript

    exports.notifyNewItemHandler = async (event, context) => {
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
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Ahora, modifiquemos el método `getItem()` para recibir también el `subsegmento` como parámetro y creemos un subsegmento adicional para capturar cualquier lógica empresarial dentro de este método. También añadiremos la carga útil del mensaje como metadatos.

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


1. Por último, modifica el método `handler` para pasar el subsegmento al método `getItem()`.
   
    ```javascript
    response = await getItem(record, subsegment)
    ```

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js***.

**El archivo completo debería verse como el que está a continuación:**

{{% expand "Fully modified file (expand for code)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

exports.notifyNewItemHandler = async (event, context) => {
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
