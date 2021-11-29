+++
title = "Modificando el SAM Template"
weight = 12
+++

En este paso, vamos a definir un par de métricas que queremos capturar entre nuestros tres servicios principales e instrumentaremos el método `logMetricEMF()` para enviarlas de forma asíncrona a CloudWatch Metrics, registrándolas primero en CloudWatch Logs y luego procesadas en segundo plano por el módulo de utilidades que implementamos en el paso anterior.

### Definiendo métricas

Definamos las siguientes métricas empresariales y operativas:
- `ColdStart`
- `UnsupportedHTTPMethod`
- `SuccessfulGetAllItems`
- `FailedGetAllItems`

### Modificar la plantilla de SAM

1. Regresa a tu ambiente de **Cloud9** y abre el espacio de trabajo de la aplicación ***serverless-observability-workshop/code/sample-app***.

    Estamos editando el archivo  ***serverless-observability-workshop/code/sample-app/template.yaml*** para incluir un `(Espacio de nombres personalizado) Custom Metric Namespace` para todas las funciones `Lambda` de la plantilla. Abre la plantilla YAML y localiza la sección Global. Adiciona la variable de entorno `AWS_EMF_NAMESPACE`para Lambda.

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

    Guarda los cambios en el archivo  ***serverless-observability-workshop/code/sample-app/template.yaml***.
