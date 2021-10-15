+++
title = "Crear grupos de X-Ray"
weight = 80
+++

Con una expresión de filtro, puedes definir criterios según los cuales aceptar trazas en el grupo.

Puede llamar al grupo por su nombre o por nombre de recurso de Amazon (ARN) para generar su propio gráfico de servicios, resúmenes de seguimiento y métricas de Amazon CloudWatch. Una vez creado un grupo, las trazas entrantes se comparan con la expresión de filtro del grupo a medida que se almacenan en el servicio X-Ray. Las métricas del número de seguimientos que coinciden con cada criterio se publican en CloudWatch cada minuto.

La actualización de la expresión de filtro de un grupo no cambia los datos que ya están registrados. La actualización solo se aplica a los seguimientos posteriores. Esto puede dar lugar a un gráfico combinado de las expresiones nuevas y antiguas. Para evitarlo, borra el grupo actual y crea uno nuevo.

### Crear un grupo de X-Ray

1. Ir a [AWS XRay](https://console.aws.amazon.com/xray/home#service-map) y hacer clic en **(Valor predeterminado) Default** y en la lista desplegable seleccionar **Crear grupo**.

    ![Service Lens](/images/xray_group.png)

2. En la nueva ventana, asigna al grupo el nombre **Higherlatency** e introduzce la siguiente expresión. Se trata de una expresión sencilla que filtra únicamente las solicitudes que presentan un tiempo de respuesta superior a 2 segundos.

    ```SQL
    responsetime > 2
    ```

    ![Service Lens](/images/xray_group_11.png)


{{% notice tip %}}
También puedes crear expresiones de filtro mediante las anotaciones personalizadas que creamos en el paso anterior, por ejemplo, agrupar todas las solicitudes fallidas mediante la expresión de filtro:
`Annotation.Status = "FAILED"`
{{% /notice %}}

3. **(Opcional)** Espera un tiempo (entre 9 y 10 minutos) desde tu última prueba de API e invoca una vez más tu API.

    ```sh
    export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
    echo "export ApiUrl="$ApiUrl
    curl -X GET $ApiUrl/items/ | jq
    ```

4. **(Opcional)** Una vez creado y seleccionado, verás que el mapa de servicios cambia para mostrar solo los servicios y rutas que muestran un tiempo de respuesta de más de 2 segundos.

    ![Service Lens](/images/xray_group_1.png)

    Cuando se crea un grupo, X-Ray también publica nuevas métricas.

5. **(Opcional)** Ir al espacio de nombres de XRay [CloudWatch Metrics](https://console.aws.amazon.com/cloudwatch/home?#metricsV2:graph=~();namespace=~'AWS*2fX-Ray). Hacer clic en **Group Metrics**.

    Verás una nueva métrica llamada `ApproximateTraceCount` creada para el grupo `Higherlatency` que acabas de crear.

    ![Service Lens](/images/xray_group_2.png)

{{% notice warning %}}
Después de crear un grupo de X-Ray, las trazas anteriores estarán disponibles en la pestaña `(Traza) Trace`, pero solo las nuevas invocaciones generarán `CloudWatch Metrics` o estarán disponibles en la pantalla `(Mapa de servicio) Service Map`. 
{{% /notice %}}
