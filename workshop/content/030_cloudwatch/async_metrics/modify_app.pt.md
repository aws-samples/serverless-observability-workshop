+++
title = "Modificando o Código do Aplicativo"
weight = 12
+++

Nesta etapa, vamos definir algumas métricas que buscamos capturar entre nossos três serviços principais, e instrumentaremos o método `logMetric()` para enviá-los de forma assíncrona para CloudWatch Metrics, tendo-os primeiro registrados no CloudWatch Logs e em seguida, processado em segundo plano pelo módulo de utilitário que implementamos na etapa anterior.

### Definindo métricas

Vamos definir as seguintes métricas de negócios e operacionais:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetItem`
- `FailedGetItem`

### Modificando a função Get Item By ID 

#### Importando Dependências

1. Abra a função Lambda localizada em ***/ serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js*** e comece importando as dependências `MetricUnit` e `logMetric` necessárias no início do arquivo e inicializando uma variável `_cold_start` para capturar inicializações com essa característica em nossas execuções lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { MetricUnit } = require('../lib/helper/models')
    const { logMetric } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Adicionando LogMetric 

1. Agora, dentro do `getByIdHandler()` vamos testar se é a primeira execução de um determinado contêiner Lambda e rotulá-lo como `Cold Start`, também enviando essas informações como uma CloudWatch Metric usando nosso método`logMetric()`. Adicione uma instrução `if` verificando se a variável`_cold_start` é `true` ou `false` logo após o início do bloco `try`.

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

1. Agora, vamos capturar métricas para `UnsupportedHTTPMethod`, instrumentando a chamada do método `logMetric()`se nosso `if (event.httpMethod! == 'GET')`for verdadeiro.

    ```javascript
    if (event.httpMethod !== 'GET') {
      await logMetric(name = 'UnsupportedHTTPMethod', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. Em seguida, estamos prontos para adicionar nossas métricas de negócios para recuperações de itens com êxito e com falha por um determinado ID. Ainda dentro de seu `getByIdHandler()`, encontre e adicione no final de seu `try` e início de seus blocos de `catch` as métricas para `SuccessfulGetItem` e `FailedGetItem`:

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

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app/src/handlers/get-by-id.js***.

    **Seu método getByIdHandler deve ser parecido com o abaixo**

    {{% expand "Método getByIdHandler completo (expandir para o código)" %}}

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


### Implantar o aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Teste a operação `Get Item By ID` 

```sh
curl -X GET $ApiUrl/items/1 | jq
```
