+++
title = "Ativando o Lambda Insights"
weight = 91
+++

`Amazon CloudWatch Lambda Insights` CloudWatch Lambda Insights é uma solução de monitoramento e solução de problemas para aplicativos serverless em execução no AWS Lambda. A solução coleta, agrega e resume as métricas de nível de sistema, incluindo tempo de CPU, memória, disco e rede. Ele também coleta, agrega e resume informações de diagnóstico, como inicializações a frio (cold start) e desligamentos de workers do Lambda, para ajudá-lo a isolar problemas com as funções do Lambda e resolvê-los rapidamente.

{{% notice tip %}}
Saiba mais sobre [Amazon CloudWatch Lambda Insights](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html) em nossa documentação.
{{% /notice %}}


### Modificar o aplicativo

Volte para o seu **Ambiente Cloud9** e abra o espaço de trabalho do seu aplicativo em ***serverless-observability-workshop/code/sample-app***.

Vamos editar o arquivo ***serverless-observability-workshop/code/sample-app/template.yaml*** para incluir a `Lambda Layer` contendo a `Lambda Insights Extension` para todas as funções `Lambda` presentes em nosso modelo. Abra o seu modelo YAML e localize a seção Global. Adicione o atributo `Layers` para Lambda e especifique a versão desejada de sua extensão.

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
        # Enable usage of KeepAlive to reduce overhead of short-lived actions, like DynamoDB queries
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1
    Layers:                                                                                 # <----- ADD FOR LAMBDA INSIGHTS
      - !Sub "arn:aws:lambda:${AWS::Region}:580247275435:layer:LambdaInsightsExtension:14"  # <----- ADD FOR LAMBDA INSIGHTS
```

Salve suas alterações no arquivo ***serverless-observability-workshop/code/sample-app/template.yaml***.

{{% notice tip %}}
Saiba mais sobre [todas as versões de Lambda Insights Extensions disponíveis](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html) em nossa documentação.
{{% /notice %}}

### Implante (deploy) seu aplicativo

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Validar a ativação do recurso

Para garantir que o Lambda Insights esteja configurado corretamente, vá para o console de serviço [AWS Lambda](https://console.aws.amazon.com/lambda/home?#functions?f0=true&n0=false&op=and&v0=monitoring).

Clique em **your-function** > **Configuration** > **Monitoring tools** e confirme que o `Enhanced Monitoring` está ativo.

![Lambda Insights](/images/li_1.png)

