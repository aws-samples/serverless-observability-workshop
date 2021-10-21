+++
title = "Modificando el código de la aplicación"
weight = 11
+++

En este paso, vamos a definir un par de métricas que queremos capturar entre nuestros tres servicios principales e instrumentaremos el método `putMetric()` para enviarlas de forma síncrona CloudWatch Metrics.

### Definiendo métricas

Definamos las siguientes métricas empresariales y operativas:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulPutItem`
- `FailedPutItem`

### Modificar la función Put Item

#### Importando dependencias

1. Abre la función Lambda localizada en  ***/serverless-observability-workshop/code/sample-app/src/handlers/put-item.js*** e inicia la importación de dependencias requeridas para `MetricUnit` y `putMetric` al inicio del archivo inicializando la variable `_cold_start` ara capturar los inicios en frío de las ejecuciones de Lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { putMetric } = require('../lib/logging/logger')

    let _cold_start = true
    ```

    #### Agregando PutMetric

1. Ahora, dentro del método `putItemHandler()` amos a probar si es la primera ejecución de un contenedor Lambda determinado y lo etiquetaremos como `Cold Start`, y también enviaremos esta información como una métrica de CloudWatch usando nuestro método `putMetric()`. Agregamos una sentencia `if` comprobando si la variable `_cold_start` es `true` o `false` justo después del comienzo del bloque `try`.

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

1. Ahora, capturaremos las métricas para `UnsupportedHTTPMethod`, instrumentalizando el llamado del método `putMetric()` si el resultado de la evaluación `if (event.httpMethod !== 'POST')` es true.

    ```javascript
        if (event.httpMethod !== 'POST') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

    ```

1. A continuación, estamos listos para añadir nuestras métricas de negocio para recuperar listas de artículos exitosas o fallidas. Aún dentro del método `putItemHandler()`, encuentra y agrega al final del bloque `try` al comienzo del bloque `catch` las métricas de `SuccessfulPutItem` y `FailedPutItem`:

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

1. Guarda los cambios en el archivo ***serverless-observability-workshop/code/sample-app/src/handlers/put-item.js***.

    **El método getAllItemsHandler debería verse como el siguiente**

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

### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```
