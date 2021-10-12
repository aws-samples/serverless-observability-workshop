+++
title = "Modificando el código de la aplicación"
weight = 12
+++

IEn este paso, vamos a definir un par de métricas que queremos capturar entre nuestros tres servicios principales e instrumentaremos el método `logMetricEMF()` para enviarlas de forma asíncrona a CloudWatch Metrics, registrándolas primero en CloudWatch Logs y luego procesadas en segundo plano por el módulo de utilidades que implementamos en el paso anterior.

### Definiendo métricas

Definamos las siguientes métricas empresariales y operativas:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetAllItems`
- `FailedGetAllItems`

### Modificar la plantilla de SAM

1. Regresa a tu ambiente de **Cloud9** y abre el espacio de trabajo de la aplicación ***serverless-observability-workshop/code/sample-app***.

    Estamos editando el archivo  ***serverless-observability-workshop/code/sample-app/template.yaml*** para incluir un `(Espacio de nombres personalizado) Custom Metric Namespace` para todas las funciones `Lambda` de la plantilla. Abre la plantilla YAML y localiza la sección Global. Adiciona la variable de entorno `AWS_EMF_NAMESPACE`para Lambda.

    ```yaml
    Globals:
    Function:
        Runtime: nodejs12.x
        Timeout: 100
        MemorySize: 128
        CodeUri: ./
        Environment:
        Variables:
            APP_NAME: !Ref SampleTable
            SAMPLE_TABLE: !Ref SampleTable
            SERVICE_NAME: item_service
            ENABLE_DEBUG: false
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
            AWS_EMF_NAMESPACE: MonitoringApp # <----- ADD FOR NAMESPACE SETUP  
    ```

    Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app/template.yaml***.

    ### Modificando la función Get All Items

    #### Importando dependencias

1. Abre la función Lambda localizada en  ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** e inicia la importación de dependencias requeridas para `Unit` y `logMetricEMF` al inicio del archivo inicializando la variable `_cold_start` para capturar los inicios en frío de las ejecuciones de Lambda:

    ```javascript

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { Unit } = require("aws-embedded-metrics");
    const { logMetricEMF } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Agregando PutMetric 

1. Ahora, dentro del método `getAllItemsHandler()` vamos a probar si es la primera ejecución de un contenedor Lambda determinado y lo etiquetaremos como `Cold Start`, y también enviaremos esta información como una métrica de CloudWatch usando nuestro método `logMetricEMF()`. Agregamos una sentencia `if` comprobando si la variable `_cold_start` es `true` o `false` justo después del comienzo del bloque `try`.

    ```javascript
    exports.getAllItemsHandler = async (event, context) => {
        let response
        try {
            if (_cold_start) {
                //Metrics
                await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
                _cold_start = false
            }
    ```

1. Ahora, capturaremos las métricas para `UnsupportedHTTPMethod`, instrumentalizando el llamado del método `putMetric()` si el resultado de la evaluación `if (event.httpMethod !== 'GET')` es true.

    ```javascript
        if (event.httpMethod !== 'GET') {
            await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

    ```

1. A continuación, estamos listos para añadir nuestras métricas de negocio para recuperar listas de artículos exitosas o fallidas. Aún dentro del método  `getAllItemsHandler()`, encuentra y agrega al final del bloque `try` ay el comienzo del bloque `catch` las métricas de `SuccessfulGetAllItems` y `FailedGetAllItems`:

    ```javascript
        try{
            //After Successful Response Composition
            //Metrics
            await logMetricEMF(name = 'SuccessfulGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
        } catch (err) {
            //After Exception Handling
            //Metrics
            await logMetricEMF(name = 'FailedGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
        }
    ```

1. Guarda los cambios en el archivo ***serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** file.

**El método getAllItemsHandler debería verse como el siguiente**

{{% expand "Full getAllItemsHandler method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (_cold_start) {
            //Metrics
            await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
            _cold_start = false
        }
        if (event.httpMethod !== 'GET') {
            await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
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
        //Metrics
        await logMetricEMF(name = 'SuccessfulGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
        //Metrics
        await logMetricEMF(name = 'FailedGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
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

### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

