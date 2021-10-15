+++
title = "Habilitando Lambda Insights"
weight = 91
+++

`Amazon CloudWatch Lambda Insights` CloudWatch Lambda Insights es una solución de supervisión y solución de problemas para aplicaciones serverless que se ejecutan en AWS Lambda. La solución recopila, agrega y resume métricas a nivel del sistema, incluidos el tiempo de CPU, la memoria, el disco y la red. También recopila, agrega y resume información de diagnóstico, como los arranques en frío y los apagados de los trabajadores de Lambda, para ayudarle a aislar los problemas de las funciones de Lambda y resolverlos rápidamente.

{{% notice tip %}}
Aprende más sobre [Amazon CloudWatch Lambda Insights](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html) en la documentación.
{{% /notice %}}


### Modificar la aplicación

Regresa a tu ambiente de **Cloud9** y abre el espacio de trabajo de la aplicación ***serverless-observability-workshop/code/sample-app***.

Estamos editando el archivo ***serverless-observability-workshop/code/sample-app/template.yaml*** para incluir un `Lambda Layer` conteniendo todas las `Lambda Insights Extension` para todas las funciones  `Lambda` presentes en la plantilla. Abre la plantilla YAML y localiza la sección Global. Adiciona las `(capas) Layers` atribubidas a Lambda y especificar la versión deseada de la extensión.

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

Guarda los cambios en el archivo ***serverless-observability-workshop/code/sample-app/template.yaml***.

{{% notice tip %}}
Aprende más sobre [todas las versiones de las extensiones disponibles Lambda Insights Extensions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html) de la documentación.
{{% /notice %}}

### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

### Validar la característica habilitada

Para asegurarse de que Lambda Insights está configurado correctamente, dirígete a la consola de [AWS Lambda](https://console.aws.amazon.com/lambda/home?#functions?f0=true&n0=false&op=and&v0=monitoring). 

Clic en **(nombre-función) name-function** > **(Configuración) Configuration** > **(Herramientas de monitoreo y operaciones) Monitoring tools** y asegúrate que el `(Monitoreo Mejorado) Enhanced Monitoring` esté habilitado.

![Lambda Insights](/images/li_1.png)

