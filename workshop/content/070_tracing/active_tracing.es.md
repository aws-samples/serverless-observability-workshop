+++
title = "Agregando rastreo activo"
weight = 72
+++

`X-Ray Active Tracing` es una característica que captura automáticamente las llamadas entrantes a los servicios de AWS (Lambda, API Gateway, SNS, SQS y otros) sin necesidad de instrumentar ningún código. SAM y otros marcos también proporcionan soporte integrado para habilitar el rastreo activo en los recursos durante el tiempo de desarrollo.

{{% notice tip %}}
Aprende más sobre [X-Ray Active Tracing](https://docs.aws.amazon.com/xray/latest/devguide/xray-usage.html#xray-usage-services) en nuestra documentación.
{{% /notice %}}


### Modificación de la aplicación

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo  ***serverless-observability-workshop/code/sample-app-tracing***.

Ahora vamos a editar el archivo  ***serverless-observability-workshop/code/sample-app-tracing/template.yaml*** para incluir `Active Tracing` para todas las funciones `Lambda` y etapas de `API Gateway` que adicionaremos en la plantilla. Abre el template YAML y localiza la sección Global. Habilita los atributos `Tracing` para Lambda y `TracingEnabled` para API Gateway.

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

Guarda los cambios del archivo  ***serverless-observability-workshop/code/sample-app-tracing/template.yaml***.


### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
sam build
sam deploy
```

### Prueba de las APIs 

#### Exportar las variables de salida del stack

Para invocar nuestra API's, primero necesitamos obtener la variable de salida  `ApiUrl` que nos proporciona nuestro stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

### Validar el resultado

Ir al [ServiceLens Service Map](https://console.aws.amazon.com/cloudwatch/home?#servicelens:map) page.

![Service Lens](/images/tracing-1.png)

Ahora puedes ver el seguimiento entre `Client -> API Gateway -> Lambda` con algunas propiedades adicionales como latencia de cada nodo, peticiones/segundos y errores 5xx sin instrumentar ningún tipo de código. Pero eso no añade mucho valor en caso de que necesitemos llevar a cabo una solución de problemas más profunda, ¿correcto? En el siguiente paso, vamos a empezar a instrumentar las llamadas a otros servicios de AWS en nuestra aplicación.
