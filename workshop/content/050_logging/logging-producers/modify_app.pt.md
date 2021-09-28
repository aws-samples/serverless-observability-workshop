+++
title = "Modificando o Código do Aplicativo "
weight = 53
+++

#### Importando Dependências

1. Abra a função Lambda localizada em ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** e comece importando as dependências necessárias no início do arquivo e inicializando uma variável `log` para ser usada em nossas execuções lambda:

    ```javascript
    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient()
    const { logger_setup } = require('../lib/logging/logger')
    let log
    ```

    #### Logs de instrumentação

1. Agora, dentro de `getAllItemsHandler()` vamos inicializar nossa variável `log` e imprimir os objetos `event` e `context` para análise posterior.

    ```javascript
    exports.getAllItemsHandler = async (event, context) => {
      log = logger_setup()
      let response

      log.info(event)
      log.info(context)
    ```
1. Ainda dentro de nosso `getAllItemsHandler()`, vamos capturar logs para `UnsupportedHTTPMethod`, instrumentando a chamada do método `log.error()` se nosso `if (event.httpMethod! == 'GET')` for verdade.

    ```javascript
    if (event.httpMethod !== 'GET') {
        // Logging
        log.error({ "operation": "get-all-items", 'method': 'getAllItemsHandler', "details": `getAllItems only accept GET method, you tried: ${event.httpMethod}` })
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    ```

1. Em seguida, estamos prontos para registrar as entradas de `erro` para as recuperações da lista de itens e as entradas de `info` para os detalhes finais de execução. Ainda dentro do seu `getAllItemsHandler()`, encontre e adicione no início do seu bloco `catch` e logo antes da instrução `return` as chamadas dos métodos `log.error()` e `log.info()`, respectivamente:

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

1. Salve suas alterações no arquivo *** serverless-observability-workshop / code / sample-app / src / handlers / get-all-items.js ***.

    **Seu método getAllItemsHandler deve ser parecido com o abaixo**

    {{% expand "Método getAllItemsHandler completo (expandir para o código)" %}}
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

### Implantar (deploy) o aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Exportar as variáveis de saída da pilh

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```
