---
title: "Função Colocar Item `Put Item`"
weight: 75
---

### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho (workspace) do seu aplicativo em ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modifique a função Colocar Item `Put Item`

1. O Lambda não nos permite adicionar anotações personalizadas e metadados ao seu segmento raiz, então primeiro precisamos criar nosso subsegmento personalizado atualizando nosso manipulador (handler).


1. Edite o arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js*** para adicionar um subsegmento inicial chamado `## Handler` usando o método `AWSXRay.captureAsyncFunc()` em todo o método manipulador (handler) e fechando o `subsegmento` dentro de uma nova cláusula `finally` em nosso `try / catch`.

    ```javascript

    exports.putItemHandler = async (event, context) => {
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
1. Em seguida, estamos prontos para adicionar nossas anotações em caso de execuções bem ou mal sucedidas ao nosso ID de item fornecido. Dentro de seu `handler`, encontre e adicione no final de seu` try` e início de suas instruções `catch` as anotações para` ItemID` e `Status`:

    ````javascript
        // Initialization
        try{
            // Happy Path
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. A seguir, vamos modificar o método `putItem ()` para receber o `subsegmento` como um parâmetro e criar um subsegmento adicional para capturar qualquer lógica de negócios dentro deste método. Também estaremos adicionando a carga útil do item como metadados.

    ```javascript
    const putItem = async (event, segment) => {
        return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Item Payload', params)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Agora, vamos modificar o método `publishSns()` para receber também o `subsegmento` como um parâmetro e criar um subsegmento adicional para capturar qualquer lógica de negócios dentro deste método. Também adicionaremos a carga útil da mensagem como metadado

    ```javascript
    const publishSns = async (data, segment) => {
        return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
                //Tracing
                subsegment.addMetadata('Message Payload', msg)
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```
1. Finalmente, modifique o método `handler` para passar o subsegmento para os métodos `putItem()` e `publishSns ()`.
   
    ```javascript
    const item = await putItem(event, subsegment)
    await publishSns(item, subsegment)
    ```

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js***.

**Seu arquivo inteiro deve ser semelhante ao código abaixo:**

{{% expand "Arquivo totalmente modificado (expandir para o código)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

exports.putItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            if (event.httpMethod !== 'POST') {
                throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
            }

            const item = await putItem(event, subsegment)
            await publishSns(item, subsegment)

            response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(item)
            }
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            subsegment.addAnnotation('ItemID', JSON.parse(event.body).id)
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

const putItem = async (event, segment) => {
    return AWSXRay.captureAsyncFunc('## putItemData', async (subsegment) => {
        let response
        try {
            const body = JSON.parse(event.body)
            const id = body.id
            const name = body.name

            var params = {
                TableName: process.env.SAMPLE_TABLE,
                Item: { id: id, name: name }
            }

            response = await docClient.put(params).promise()

            //Tracing
            subsegment.addMetadata('Item Payload', params)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}


const publishSns = async (data, segment) => {
    return AWSXRay.captureAsyncFunc('## publishNewItemSNS', async (subsegment) => {
        let response
        try {
            const msg = {
                TopicArn: process.env.TOPIC_NAME,
                Message: JSON.stringify({
                    operation: "notify_new_item",
                    details: {
                        //id: data.Attributes.id,
                        //name: data.Attributes.FullName ? data.Attributes.FullName : "N/A"
                        id: 1,
                        name: "N/A"
                    }
                }),
                MessageAttributes: {
                    "Status": { "DataType": "String", "StringValue": "Success" }
                }
            }

            response = await sns.publish(msg).promise()

            subsegment.addMetadata('Message Payload', msg)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```