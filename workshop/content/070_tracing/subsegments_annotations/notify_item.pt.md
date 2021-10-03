---
title: "Função Notificar Novo Item `Notify New Item`"
weight: 76
---

### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho (workspace) do seu aplicativo em ***serverless-observability-workshop/code/sample-app-tracing***.

#### Modifique a função Notificar Novo Item `Notify New Item`

1. O Lambda não nos permite adicionar anotações personalizadas e metadados ao seu segmento raiz, então primeiro precisamos criar nosso subsegmento personalizado atualizando nosso manipulador (handler).

1. Edite o arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js*** para adicionar um subsegmento inicial chamado `## Handler` usando o método `AWSXRay.captureAsyncFunc()` em todo o método manipulador (handler) e fechando o `subsegmento` dentro de uma nova cláusula `finally` em nosso` try / catch`.

    ```javascript

    exports.notifyNewItemHandler = async (event, context) => {
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
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch(err) {
            // Exception Handling
            //Tracing
            subsegment.addAnnotation('Status', 'FAILED')
        }
    ````

1. A seguir, vamos modificar o método `getItem()` para receber o `subsegmento` como um parâmetro e criar um subsegmento adicional para capturar qualquer lógica de negócios dentro deste método.

    ```javascript
    const getItem = async (record, segment) => {
        return AWSXRay.captureAsyncFunc('## subscribeSNSNewItem', async (subsegment) => {
            // Initialization
            try {
                // Happy Path
            } catch (err) {
                // Exception Handling
            } finally {
                subsegment.close()
            }
            return response
        }, segment);
    }
    ```

1. Finalmente, modifique o método `handler` para passar o subsegmento para o método `getItem()`.
   
    ```javascript
    response = await getItem(record, subsegment)
    ```

1. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js***.

**Seu arquivo inteiro deve ser semelhante ao código abaixo:**

{{% expand "Arquivo totalmente modificado (expandir para o código)" %}}

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

exports.notifyNewItemHandler = async (event, context) => {
    return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
        let response
        try {
            const record = JSON.parse(event.Records[0].Sns.Message)
            response = await getItem(record, subsegment)
            //Tracing
            //subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'SUCCESS')
        } catch (err) {
            //Tracing
            //subsegment.addAnnotation('ItemID', id)
            subsegment.addAnnotation('Status', 'FAILED')
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, AWSXRay.getSegment());
}


const getItem = async (record, segment) => {
    return AWSXRay.captureAsyncFunc('## subscribeSNSNewItem', async (subsegment) => {
        let response
        try {
            response = JSON.stringify(record)
        } catch (err) {
            throw err
        } finally {
            subsegment.close()
        }
        return response
    }, segment);
}
```
