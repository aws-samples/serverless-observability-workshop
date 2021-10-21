+++
title = "Prueba de carga de la aplicación"
weight = 92
+++

Para ver cómo nuestra aplicación soporta los picos de tráfico, vamos a usar [Locust](https://locust.io/) para probar la carga de nuestras 3 API simultáneamente. Para esta prueba, vamos a emular el acceso de **250 usuarios simultáneos durante 10 minutos** generando usuarios a una tasa de **10 usuarios/seg**

### Exportar las variables de salida del stack

Para invocar nuestra API’s, primero necesitamos obtener la variable de salida  `ApiUrl` que nos proporciona nuestro stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Ejecutar la prueba de carga

En el ambiente de **Cloud9**, ejecute los siguientes comandos:

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
locust -f locust-script.py -H ${ApiUrl} --headless -u 250 -r 10 -t 10m
```

{{% notice warning %}}
Recuerda que esta prueba va a tardar **10 minutos** en completarse. 
{{% /notice %}}

Después de finalizar deberías ver tu terminal con un resultado como el siguiente:

![Lambda Insights](/images/li_2.png)

¿Notaste que la operación `/POST` no presentaba errores y mantenía su latencia relativamente baja mientras que las otras dos operaciones `/GET` presentaban una tasa de error y una latencia general muy elevadas? En el siguiente paso, trataremos de entender por qué.
