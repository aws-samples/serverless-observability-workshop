+++
title = "Modificando o Código do Aplicativo"
weight = 12
+++

Nesta etapa, vamos definir algumas métricas que queremos capturar entre os nossos três serviços principais, e instrumentaremos o método `logMetricEMF()` para enviá-los de forma assíncrona para CloudWatch Metrics, tendo-os primeiro registrados no CloudWatch Logs e em seguida, processado em segundo plano pelo módulo de utilitário que implementamos na etapa anterior.

### Definindo métricas

Vamos definir as seguintes métricas de negócios e operacionais:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetAllItems`
- `FailedGetAllItems`

### Modifique o modelo SAM

1. Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho do seu aplicativo em ***serverless-observability-workshop/code/sample-app***.

    Vamos editar o arquivo ***serverless-observability-workshop/code/sample-app/template.yaml*** para incluir um `Custom Metric Namespace` para todas as funções `Lambda` em nosso modelo. Abra o seu modelo YAML e localize a seção Global. Adicione a variável de ambiente `AWS_EMF_NAMESPACE` para Lambda.

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

   Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app/template.yaml***.

    ### Modificando a função Get All Items

    #### Importando Dependências

1. Abra a função Lambda localizada em ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** e comece importando as dependências `Unit` e `logMetricEMF` necessárias no início do arquivo e inicializando uma variável `_cold_start` para capturar inicializações com essas características em nossas execuções lambda:

    ```javascript

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { Unit } = require("aws-embedded-metrics");
    const { logMetricEMF } = require('../lib/logging/logger')

    let _cold_start = true

    ```

    #### Adicionando PutMetric 

1. Agora, dentro do `getAllItemsHandler()` vamos testar se é a primeira execução de um determinado contêiner Lambda e rotulá-lo como `Cold Start`, também enviando essas informações como uma CloudWatch Metric usando nosso método `logMetricEMF()`. Adicione uma instrução `if` verificando se a variável `_cold_start` é `true` ou `false` logo após o início do bloco `try`.

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

1. Agora, vamos capturar métricas para `UnsupportedHTTPMethod`, instrumentando a chamada do método `putMetric()`se nosso `if (event.httpMethod! == 'GET')`for verdadeiro.

    ```javascript
        if (event.httpMethod !== 'GET') {
            await logMetricEMF(name = 'UnsupportedHTTPMethod', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

    ```

1. Em seguida, estamos prontos para adicionar nossas métricas de negócios para recuperações de lista de itens com êxito e com falha. Ainda dentro de `getAllItemsHandler()`, encontre e adicione no final de seu `try` e início de seus blocos de `catch` as métricas para `SuccessfulGetAllItems` e `FailedGetAllItems`:

    ```javascript
        try{
            //After Sucessful Response Composition
            //Metrics
            await logMetricEMF(name = 'SuccessfulGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
        } catch (err) {
            //After Exception Handling
            //Metrics
            await logMetricEMF(name = 'FailedGetAllItems', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-all-items' })
        }
    ```

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js***.

**Seu método getAllItemsHandler deve ser parecido com o abaixo**

{{% expand "Método getAllItemsHandler completo (expandir para o código)" %}}
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

### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

