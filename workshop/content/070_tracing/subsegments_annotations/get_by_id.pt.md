---
title: "Função Obter Todos por ID `Get Item By ID`"
weight: 78
---

### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho (workspace) do seu aplicativo em ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modifique a função Obter todos os itens por ID `Get Item By ID`

1. O Lambda não nos permite adicionar anotações personalizadas e metadados ao seu segmento raiz, então primeiro precisamos criar nosso subsegmento personalizado atualizando nosso manipulador (handler).

1. Edite o arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js*** para adicionar um subsegmento inicial chamado `## Handler` usando o método `AWSXRay.captureAsyncFunc()` em todo o método manipulador (handler) e fechando o `subsegmento` dentro de uma nova cláusula `finally` em nosso` try / catch`.

    ```javascript

    exports.getByIdHandler = async (event, context) => {
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
            subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. A seguir, vamos modificar o método `getItemById()` para receber o `subsegmento` como um parâmetro e criar um subsegmento adicional para capturar qualquer lógica de negócios dentro deste método. Também estaremos adicionando a carga útil do item como metadados.

    ```javascript
    const getItemById = async (id, segment) => {
        return AWSXRay.captureAsyncFunc('## getItemData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Item', response)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Finalmente, modifique o método `handler` para passar o subsegmento para o método `getItemById()`.
   
    ```javascript
    const item = await getItemById(id, subsegment)
    ```

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js***.

**Seu arquivo inteiro deve ser semelhante ao código abaixo:**

{{% expand "Arquivo totalmente modificado (expandir para o código)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()

exports.getByIdHandler = async(event, context) => {
  return AWSXRay.captureAsyncFunc('## Handler', async(subsegment) => {
    let response, id
    try {
      if (event.httpMethod !== 'GET') {
        throw new Error(`getById only accept GET method, you tried: ${event.httpMethod}`)
      }

      id = event.pathParameters.id
      const item = await getItemById(id, subsegment)

      response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(item)
      }
      //Tracing
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'SUCCESS')
    }
    catch (err) {

      response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(err)
      }
      //Tracing
      subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'FAILED')
    }
    finally {
      subsegment.close()
    }
    return response
  }, AWSXRay.getSegment());
}


const getItemById = async(id, segment) => {
  return AWSXRay.captureAsyncFunc('## getItemData', async(subsegment) => {
    let response
    try {
      var params = {
        TableName: process.env.SAMPLE_TABLE,
        Key: { id: id }
      }

      response = await docClient.get(params).promise()
      //Tracing
      subsegment.addMetadata('Item', response)
    }
    catch (err) {
      throw err
    }
    finally {
      subsegment.close()
    }
    return response
  }, segment);
}

```