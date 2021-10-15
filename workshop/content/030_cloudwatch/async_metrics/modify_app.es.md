+++
title = "Modificando el código de la aplicación"
weight = 12
+++

En este paso, vamos a definir un par de métricas que queremos capturar entre nuestros tres servicios principales, e instrumentaremos el método `logMetric()` para enviarlas de forma asíncrona a CloudWatch Metrics, registrándolas primero en CloudWatch Logs y luego procesadas en segundo plano por el módulo de utilidad que implementado en el paso anterior.

### Definiendo métricas

Definamos las siguientes métricas empresariales y operativas:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetItem`
- `FailedGetItem`

### Modificación de la función Get Item By ID

#### Importando dependencias

1. Abre la función Lambda ubicada en ***/serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** y empieza importando las dependencias `MetricUnit` y `LogMetric`, necesarias al principio del archivo e inicializando una variable `_cold_start` para capturar los inicios en frío en nuestras ejecuciones lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { logMetric } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Adicionando LogMetric 

1. Ahora, dentro de `getByIdHandler() `vamos a probar si es la primera ejecución de un contenedor Lambda dado y lo etiquetaremos como `Cold Start`, también enviando esta información como una métrica de CloudWatch usando nuestro método `logMetric ()`. Agrege una declaración de `if` comprobando si la variable `_cold_start` es `true` o `false` justo después del comienzo del bloque `try`.

    ```javascript
    exports.getByIdHandler = async (event, context) => {
      let response
      try {
        if (_cold_start) {
            //Metrics
            await logMetric(name = 'ColdStart', unit = MetricUnit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
    ```

1. Ahora, capturaremos las métricas para `UnsupportedHTTPMethod`, instrumentando el llamado del método `logMetric()` si la evaluación de `if (event.httpMethod !== 'GET')` es true.

    ```javascript
    if (event.httpMethod !== 'GET') {
      await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. A continuación, estamos listos para añadir nuestras métricas de negocio para que las recuperaciones según un ID dado. Aún dentro del método`getByIdHandler()`, encuentra y agrega al final de la sentencia `try` y el comienzo del bloque `catch`  las métricas de `successfulGetItem` y `failedGetItem`:

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

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js***.

    **El método getByIdHandler debería verse como el siguiente**

    {{% expand "Full getByIdHandler method (expandir para ver el código)" %}}

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


### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Exportar las variables de salida del stack

Para invocar nuestra API's, primero necesitamos obtener la variable de salida  `ApiUrl` que nos proporciona nuestro stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Probar la operación `Get Item By ID`

```sh
curl -X GET $ApiUrl/items/1 | jq
```
