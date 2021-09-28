+++
title = "Adicionando Rastreamento Ativo"
weight = 72
+++

O `X-Ray Rastreamento Ativo (Active Tracing)` é um recurso que captura automaticamente chamadas de entrada para os Serviços AWS (Lambda, API Gateway, SNS, SQS e outros) sem exigir que você instrumentalize nenhum código. O SAM e outras estruturas também fornecem suporte integrado para você habilitar o rastreamento ativo em seus recursos durante o tempo de desenvolvimento.


{{% notice tip %}}
Saiba mais sobre [Rastreamento ativo do X-Ray] (https://docs.aws.amazon.com/xray/latest/devguide/xray-usage.html#xray-usage-services) em nossa documentação.
{{% /notice %}}


### Modifique o aplicativo

Volte para o seu ambiente **Cloud9** e abra o espaço de trabalho (workspace) do seu aplicativo em ***serverless-observability-workshop/code/ ample-app-tracing***.

Vamos editar o arquivo ***serverless-observability-workshop/code/sample-app-tracing/template.yaml*** para incluir `Rastreamento ativo` para todas as funções`Lambda` e estágios do `API Gateway` que adicionamos em nosso modelo. Abra o seu modelo YAML e localize a seção Global. Habilite o atributo `Tracing` para Lambda e `TracingEnabled` para API Gateway.

```yaml
Globals:
  Function:
    Runtime: nodejs12.x
    Timeout: 100
    Tracing: Active # <----- ADD FOR LAMBDA
    MemorySize: 128
    CodeUri: ./
    Environment:
      Variables:
        APP_NAME: !Ref SampleTable
        SAMPLE_TABLE: !Ref SampleTable
        SERVICE_NAME: item_service
        ENABLE_DEBUG: false
        # Enable usage of KeepAlive to reduce overhead of short-lived actions, like DynamoDB queries
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
  Api:                    # <----- ADD FOR API
    TracingEnabled: true  # <----- ADD FOR API  
```

Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app-tracing/template.yaml***.

### Crie (Deploy) seu aplicativo

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

#### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

### Valide o resultado

Vá para a página [ServiceLens Service Map](https://console.aws.amazon.com/cloudwatch/home?#servicelens:map).

![Service Lens](/images/tracing-1.png)

Agora você pode ver o rastreamento entre `Cliente -> API Gateway -> Lambda` com algumas propriedades adicionais, como latência de cada nó, solicitações/segundo e erros 5xx sem instrumentar qualquer tipo de código. Mas isso realmente não agrega muito valor no caso de precisarmos realizar alguma solução de problemas mais profunda, certo? Na próxima etapa, vamos começar a instrumentar chamadas para outros serviços da AWS em nosso aplicativo.