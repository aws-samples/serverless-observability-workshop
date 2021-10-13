+++
title = "Modificando el código de la aplicación"
weight = 53
+++

#### Importando dependencias

1. Abre la función lambda localizada en  ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** e inicia realizando la importación de las dependencias requeridas en la cabecera del archivo e inicializando una variable `log` para ser utilizada en las ejecuciones de lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { logger_setup } = require('../lib/logging/logger')
    let log
    ```

    #### Instrumentalizando (registro) log 

1. Ahora, dentro del método `getAllItemsHandler()` inicializaremos la variable `log` e imprimiremos los objetos `event` y `context` para un análsis posterior.

    ```javascript
    exports.getAllItemsHandler = async (event, context) => {
      log = logger_setup()
      let response

      log.info(event)
      log.info(context)
    ```

1. Aún dentro del método `getAllItemsHandler()`, vamos a capturar el (registro) log para `UnsupportedHTTPMethod`, instrumentalizando el llamado al método `log.error()` si la sentencia `if (event.httpMethod !== 'GET')` es true.

    ```javascript
    if (event.httpMethod !== 'GET') {
        // Logging
        log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. A continuación, estaremos listos para registrar las entradas de `error` por ítem de la lista recuperado y las entradas `info` para los detalles de ejecución final. Aún dentro del método `getAllItemsHandler()`, localiza y adiciona al principio del bloque `catch` justo antes de la sentencia `return` los llamados a los métodos `log.error()` y `log.info()`, respectivamente:

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

1. Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js***.

    **El método getAllItemsHandler debería verse como el siguiente**

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

### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Exportar las variables de salida del stack

Para invocar nuestra API’s, primero necesitamos obtener la variable de salida  `ApiUrl` que nos proporciona nuestro stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```
