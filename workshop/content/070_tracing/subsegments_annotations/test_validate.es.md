---
title: "Despliegue y validación del (tracing) rastreo"
weight: 79
---

### Desplegar la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
sam build
sam deploy
```

### Probar las APIs 

#### Exportar las variables de salida del stack

Para invocar nuestro API, necesitamos recuperar la salida de la variable `ApiUrl` dada por el stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Probar la operación `Put Item` operation

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"5",  
        "name": "Fifth test item"
  }'

curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"6",  
        "name": "Sixth test item"
  }'
```

#### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Probar la operación `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/5 | jq
curl -X GET $ApiUrl/items/6 | jq
```

### Validar el resultado

Ir a la página de [ServiceLens Traces](https://console.aws.amazon.com/cloudwatch/home?#servicelens:traces).

Haga clic en la lista de **(Tipo de filtro) Filter type**. Ahora puedes visualizar las tres anotaciones diferentes que hemos creado como filtros adicionales para tus trazas.

![Service Lens](/images/subsegment_1.png)

- Seleccionar **Status**.
- Seleccionar **SUCCESS**.
- Clic en **(Agregar a filtro) Add to filter**.

![Service Lens](/images/subsegment_2.png)

- Haz clic en una de las trazas del método HTTP **POST**.

![Service Lens](/images/subsegment_3.png)

Esta vez, podrás ver que los subsegmentos adicionales que hemos creado aparecen ahora con sus respectivos tiempos de respuesta.

![Service Lens](/images/subsegment_4.png)

- Haz clic en el subsegmento **## Handler** y desliza hacia abajo hasta el área de `(Detalles del segmento) Segment details`. Deberías poder ver las anotaciones personalizadas que agregaste dentro de ese subsegmento.

![Service Lens](/images/subsegment_5.png)

- Haz clic en el subsegmento **## putItemData** y desliza hacia abajo hasta el área de `Segment details`. Deberías poder ver los metadatos personalizados que agregaste dentro de ese subsegmento.

![Service Lens](/images/subsegment_6.png)

{{% notice tip %}}
Date un par de minutos para analizar el mapa de servicio y las trazas de **Get Item By Id** y **Get All Items** también.
{{% /notice %}}
