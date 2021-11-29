+++
title = "Modificando o SAM Template"
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
