+++
title = "Modificando o Código do Aplicativo"
weight = 11
+++

Nesta etapa, vamos definir algumas métricas que queremos capturar entre nossos três serviços principais e instrumentaremos o método `putMetric()` para enviá-las de forma síncrona para CloudWatch Metrics.

### Definindo métricas

Vamos definir as seguintes métricas de negócios e operacionais:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulPutItem`
- `FailedPutItem`

### Modificando a função Put Item

#### Importando Dependências

1. Abra a função Lambda localizada em ***/serverless-observability-workshop/code/sample-app/src/handlers/put-item.js*** e comece importando as dependências `MetricUnit` e `putMetric` necessárias no início do arquivo e inicializar uma variável `_cold_start` para capturar inicializações com essas características em nossas execuções lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { putMetric } = require('../lib/logging/logger')

    let _cold_start = true
    ```

    #### Adicionando PutMetric

1. Agora, dentro do `putItemHandler()` vamos testar se é a primeira execução de um determinado contêiner Lambda e rotulá-lo como `Cold Start`, também enviando essas informações como uma CloudWatch Metric usando nosso método `putMetric()`. Adicione uma instrução `if` verificando se a variável `_cold_start` é `true` ou `false` logo após o início do bloco `try`.

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

1. Agora, vamos capturar métricas para `UnsupportedHTTPMethod`, instrumentando a chamada do método `putMetric()` se nosso `if (event.httpMethod! == 'POST')` for verdadeiro.

    ```javascript
        if (event.httpMethod !== 'POST') {
            await putMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'put-item' })
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }

    ```

1. Em seguida, estamos prontos para adicionar nossas métricas de negócios para inserções de itens com e sem sucesso. Ainda dentro de seu `putItemHandler()`, encontre e adicione no final de seu `try` e início de seus blocos de `catch` as métricas para `SuccessfulPutItem` e `FailedPutItem`:

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

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app/src/handlers/put-item.js***.

    **Seu método putItemHandler deve ser parecido com o abaixo**

    {{% expand "Método putItemHandler completo (expandir para o código)" %}}
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

### Implantar o aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```
