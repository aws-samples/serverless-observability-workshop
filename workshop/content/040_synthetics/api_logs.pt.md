+++
title = "API Canário"
weight = 41
+++

Vá para a página [Synthetics canary](https://console.aws.amazon.com/cloudwatch/home?#synthetics:canary/list), e clique em  **Criar canário**.

![synthetics-1](/images/synthetics1.pt.png)

### Criação de uma API Canary

1. Selecione **Canário da API** em **Blueprints**.
1. Nomeie-o como **my-api-canary**.
1. Marque a caixa de seleção **Estou usando uma API Amazon API Gateway (I'm using an Amazon API Gateway API)**.
1. Selecione a opção **Escolher API e estágio do API GAteway (Choose API and stage from API Gateway)**.
1. Selecione a API **monitoring-app**.
1. Selecione o estágio **Prod**.

    Sua URL da API será selecionada automaticamente.

    ![synthetics-2](/images/synthetics2.png)

1. Clique em **Adicionar solicitação HTTP (Add HTTP Request)**.
1. Selecione **/itens** em **Recurso (Resource)**.
1. Selecione **GET** em ** Método **.
1. Aceite todas as outras configurações padrão e clique em **Salvar**.

    ![synthetics-timer](/images/synthetics_http_request.png)
    ![synthetics-timer](/images/synthetics_http_request_1.png)

1. Na programação, configure-o para ser executado a cada 1 minuto.

    ![synthetics-timer](/images/synthetics_timer.png)

1. Aceite todas as outras configurações padrão e clique em **Criar canário**.

{{% notice tip %}}
Se você não tomou nota do URL da API após implantar o aplicativo sample app, você sempre pode verificar sua variável de saída (output) no CloudFormation utilizando o seguinte comando em seu **terminal de Ambiente Cloud9**.
{{% /notice %}}

```sh
echo $(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
```

Depois de alguns minutos, você verá uma tela semelhante a abaixo para observar o status do seu canário.

![synthetics-3](/images/synthetics3.png)

### Introduzindo Falhas

Vamos ver o que acontece se quebrarmos acidentalmente nossa API? Como estamos monitorando o método GET para a rota `/items/`, vamos modificar nossa função Lambda ***get-all-items.js*** para introduzir uma exceção aleatória e fazer nosso canário falhar.

7. Volte para o **Ambiente Cloud9** e abra o arquivo em ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js***. Modifique o método `getAllItemsHandler()` lançando um novo erro logo após a validação do método HTTP:

```javascript
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    throw new Error('Sample exception introduction') // <- Sample exception throw 
```

8. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**Seu método getAllItemsHandler() deve estar assim:**

{{% expand "Fully modified method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }
        throw new Error('Sample exception introduction') // <- Sample exception throw 

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    return response
}
```
{{% /expand  %}}


#### Instalando a aplicação

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Valide o seu Canário

Depois de alguns minutos, você deve perceber que seu canário está em um estado de `Falha (Failed)`.
 
![synthetics-4](/images/synthetics4.png)

Clique no link **my-api-canary** para ver todas as informações adicionais sobre seu canário.

![synthetics-5](/images/synthetics5.png)

### Corrigindo a API Canário

#### Rebaseamento do código da aplicação

Para que possamos passar em nossos testes canário novamente, vamos voltar para o seu **Ambiente Cloud9** e abrir o arquivo em ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** mais uma vez.

9. Agora vamos remover o erro que acabamos de introduzir, modificando o handler do Lambda removendo o comando `throw new Error()` que introduzimos no método `getAllItemsHandler()`:

```javascript
throw new Error('Sample exception introduction') // <- Remove exception throw 
```

10. Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**Seu método getAllItemsHandler() deve estar assim:**
{{% expand "Fully modified method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
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
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    return response
}
```
{{% /expand  %}}

#### Instalando a aplicação

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Valide o seu Canário

Novamente, depois de alguns minutos, você deve notar que seu canário está novamente no estado de `Passing`.

![synthetics-6](/images/synthetics6.png)
