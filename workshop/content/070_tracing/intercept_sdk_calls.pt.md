+++
title = "Interceptando chamadas do SDK da AWS"
weight = 73
+++

Nesta etapa, vamos adicionar uma pequena mudança em nosso aplicativo usando o SDK do AWS X-Ray para rastrear todas as chamadas do SDK da AWS dentro de nossas funções Lambda. Isso nos dará mais visibilidade sobre o que está acontecendo durante a execução de uma função, bem como uma visão melhor de quaisquer gargalos que não podíamos ver antes. Por exemplo, uma função Lambda pode levar 10 segundos para ser concluída, mas 9 segundos podem ser gastos chamando uma tabela do DynamoDB. Ter essas informações em mãos nos ajuda a concentrar nossos esforços para aprimorar nosso código de consulta do DynamoDB ou até mesmo remodelar nossas tabelas do DynamoDB e / ou repensar nossos padrões de acesso a dados.

{{% notice tip %}}
Você pode aprender mais sobre como aproveitar o AWS X-Ray SDK para capturar todos os rastreamentos [chamadas do AWS SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-awssdkclients.html), [Solicitações recebidas](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-middleware.html), [Chamadas HTTP enviadas](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-httpclients.html) e [Consultas SQL](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-sqlclients.html)
{{% /notice %}}

### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho do seu aplicativo em ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js***.

Agora vamos importar o módulo `aws-xray-sdk-core` e em vez de exigir puramente o módulo `aws-sdk` usando a sintaxe `const AWS = AWSXRay.captureAWS (require ('aws-sdk'))`, vamos importá-lo usando o X-Ray para capturar todas as chamadas de serviços da AWS usando o SDK da AWS.

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
```

Você também deve modificar da mesma forma as funções Lambda localizadas em:
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js`
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js`
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js`

### Implante (deploy) o aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
sam build
sam deploy
```

### Teste as APIs

#### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Teste a operação `Put Item`

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"3",  
        "name": "Third test item"
  }'

curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"4",  
        "name": "Fourth test item"
  }'
```

#### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Teste a operação `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/3 | jq
curl -X GET $ApiUrl/items/4 | jq
```

### Validar o resultado

Vá para a página [ServiceLens Service Map](https://console.aws.amazon.com/cloudwatch/home?#servicelens:map).

![Service Lens](/images/tracing_sdk_1.png)

Agora você pode ver o rastreamento entre `Cliente -> API Gateway -> Lambda -> Outros Serviços Downstream` e as mesmas propriedades adicionais (latência, solicitações/segundos e 5xx erros) que já vimos na etapa anterior.

- Clique no nó **NoticeNewItemFunction** no Mapa de Serviço.
- Clique em **View Traces**

![Service Lens](/images/tracing_sdk_2.png)

Agora você pode ver todo o rastreamento de todas as solicitações de um determinado nó, bem como filtrá-los por uma ampla gama de atributos e anotações personalizadas (que iremos adicionar na próxima etapa).

![Service Lens](/images/tracing_sdk_3.png)

Você também pode visualizar a distribuição do tempo de resposta de seus rastreamentos e verificá-los individualmente.

- Clique no traço com o `tempo de resposta mais discrepante`, que provavelmente representa uma função Lambda contendo um `Cold Start`.

![Service Lens](/images/tracing_sdk_4.png)

Agora você pode se aprofundar nos detalhes de uma solicitação específica que deseja solucionar ou entender seu comportamento. Você pode ver a malha completa de chamadas realizadas pela função principal e suas dependências downstream, bem como seu tempo de resposta completo, código de status e assim por diante.

![Service Lens](/images/tracing_sdk_5.png)

Você também pode ver o tempo de resposta e anotações adicionais e metadados de cada `segmento` e `subsegmento` para cada nó de rastreamento de solicitação. Analisando um pouco mais adiante, você pode ver que o `AWS X-Ray SDK` capturou as chamadas que fizemos para` DynamoDB` e `SNS`, bem como as `Operações de API` que realizamos.

![Service Lens](/images/tracing_sdk_6.png)
