+++
title = "Interceptando llamados con AWS SDK"
weight = 73
+++

En este paso, vamos a añadir un pequeño cambio a nuestra aplicación mediante el SDK de AWS X-Ray para rastrear todas las llamadas al SDK de AWS dentro de nuestras funciones de Lambda. Esto nos dará mayor visibilidad sobre lo que está sucediendo durante la ejecución de una función, así como una mejor visión de los cuellos de botella que no pudimos ver antes. Por ejemplo, una función Lambda puede tardar 10 segundos en completarse, pero se pueden gastar 9 segundos en llamar a una tabla de DynamoDB. Tener esta información a mano nos ayuda a centrar nuestros esfuerzos en mejorar nuestro código de consulta de DynamoDB o incluso remodelar nuestras tablas de DynamoDB y/o replantear nuestros patrones de acceso a los datos.

{{% notice tip %}}
Puedes obtener más información sobre cómo aprovechar el SDK de AWS X-Ray para capturar trazas [llamados a AWS SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-awssdkclients.html), [solicitudes entrantes](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-middleware.html), [llamadas HTTP salientes](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-httpclients.html), and [Consultas SQL](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-sqlclients.html)
{{% /notice %}}

### Modificación la aplicación

Regresa al ambiente de **Cloud9** y abre el espacio de trabajo en ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/put-item.js***.

Ahora vamos a importar el módulo `aws-xray-sdk-core` y en lugar de requerir únicamente el módulo `aws-sdk` utilizando la sintaxis `const AWS = AWSXRay.captureAWS(require('aws-sdk'))`, vamos a importarlo usando X-Ray para capturar todas las llamadas a los servicios de AWS con el SDK de AWS.

```javascript
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
```

También debes modificar de la misma forma las funciones de Lambda ubicadas en:
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js`
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-by-id.js`
- `serverless-observability-workshop/code/sample-app-tracing/src/handlers/notify-item.js`

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

#### Probar la operación `Put Item`

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

#### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Probar la operación `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/3 | jq
curl -X GET $ApiUrl/items/4 | jq
```

### Validar el resultado

Ir a la página [ServiceLens Service Map](https://console.aws.amazon.com/cloudwatch/home?#servicelens:map).

![Service Lens](/images/tracing_sdk_1.png)

Ahora puedes ver el seguimiento entre `Client -> API Gateway -> Lambda -> Other Downstream Services` y las mismas propiedades adicionales (latencia, peticiones/segundos y errores 5xx) que ya vimos en el paso anterior.

- Clic en el nodo **notifyNewItemFunction** del mapa de servicios.
- Clic en **(Ver trazas) View Traces**

![Service Lens](/images/tracing_sdk_2.png)

Ahora puedes ver el seguimiento completo de todas las solicitudes de un nodo determinado, así como filtrarlas por una amplia gama de atributos y anotaciones personalizadas (que añadiremos en el siguiente paso).

![Service Lens](/images/tracing_sdk_3.png)

También puedes visualizar la distribución del tiempo de respuesta de tus trazas y comprobarlas individualmente.

- Haga clic en el trazado con el `(tiempo de respuesta más discrepante) most discrepant response time`, que probablemente representa una función Lambda que contiene un `(arranque en frío) Cold Start`.

![Service Lens](/images/tracing_sdk_4.png)

Ahora puedes profundizar en los detalles de una solicitud específica que quieres solucionar o entender su comportamiento. Puedes ver el grafo completo de llamadas realizadas por la función principal y sus dependencias descendentes, así como su tiempo de respuesta completo, código de estado, etc.

![Service Lens](/images/tracing_sdk_5.png)

También puedes ver el tiempo de respuesta y las anotaciones y metadatos adicionales de cada `(segmento) segment` y `(subsegmento) subsegment` para cada nodo del seguimiento de la solicitud. Analizando un poco más, puede ver que el `AWS X-Ray SDK` capturó las llamadas que hicimos tanto a `DynamoDB` como a `SNS`, así como las `Operaciones de API` que realizamos.

![Service Lens](/images/tracing_sdk_6.png)
