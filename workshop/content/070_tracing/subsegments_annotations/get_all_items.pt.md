---
title: "Função Obter Todos os Itens `Get All Items`"
weight: 77
---

### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho (workspace) do seu aplicativo em ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modifique a função Obter todos os itens `Get All Items`

1. O Lambda não nos permite adicionar anotações personalizadas e metadados ao seu segmento raiz, então primeiro precisamos criar nosso subsegmento personalizado atualizando nosso manipulador (handler).

1. Edite o arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js*** para adicionar um subsegmento inicial chamado `## Handler` usando o método `AWSXRay.captureAsyncFunc()` em todo o método manipulador (handler) e fechando o `subsegmento` dentro de uma nova cláusula `finally` em nosso` try / catch`.

    ```javascript

    exports.getAllItemsHandler = async (event, context) => {
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
1. Em seguida, estamos prontos para adicionar nossas anotações em caso de execuções bem ou mal sucedidas ao nosso ID de item fornecido. Dentro de seu `handler`, encontre e adicione no final de seu` try` e início de suas instruções `catch` as anotações para` ItemsCount` e `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('ItemsCount', items.Count)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. Agora, vamos modificar o método `getAllItems()` para também receber o `subsegmento` como um parâmetro e criar um subsegmento adicional para capturar qualquer lógica de negócios dentro deste método. Também adicionaremos a carga útil (payload) da mensagem como um metadados.

    ```javascript
    const getAllItems = async (segment) => {
        return AWSXRay.captureAsyncFunc('## getAllItemsData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('items', response)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Finalmente, modifique o método `handler` para passar o subsegmento para o método `getAllItems()`.

    ```javascript
    const items = await getAllItems(subsegment)
    ```

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**Seu arquivo inteiro deve ser semelhante ao código abaixo:**

{{% expand "Arquivo totalmente modificado (expandir para o código)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getAllItemsHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            if (event.httpMethod !== 'GET') {
                throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
            }

            const items = await getAllItems(subsegment)
            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(items)
            }
            //Tracing
            subsegment.addAnnotation('ItemsCount', items.Count)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
            response = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err)
            }
        } finally {
            subsegment.close()
        }
        return response
    }, AWSXRay.getSegment());
}


const getAllItems = async (segment) => {
    return AWSXRay.captureAsyncFunc('## getAllItemsData', async (subsegment) => {
        let response
        try {
            var params = {
                TableName: process.env.SAMPLE_TABLE
            }
            response = await docClient.scan(params).promise()
            //Tracing
            subsegment.addMetadata('items', response)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```