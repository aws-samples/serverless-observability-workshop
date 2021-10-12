+++
title = "Crear alarma basada en métrica"
weight = 11
+++

Una alarma basada en métrica observa una sola métrica de CloudWatch o el resultado de una expresión matemática basada en métricas de CloudWatch. La alarma realiza una o varias acciones en función del valor de la métrica o expresión en relación con un umbral durante varios períodos de tiempo. La acción puede ser una acción de Amazon EC2, una acción de Amazon EC2 Auto Scaling o una notificación enviada a un tema de Amazon SNS.

### Creando alarma basada en métrica

Ingrese a la [Consola de CloudWatch Alarmas](https://console.aws.amazon.com/cloudwatch/home?#alarmsV2:).

1. Haga clic en **(Crear alarma) Create Alarm**.
1. Click **(Seleccionar Métrica) Select Metric**.
1. Esto te llevará a la página de inicio de Métricas, donde verás todos los espacios de nombres disponibles en la cuenta. Seleccione el espacio de nombres `MonitoringApp`

![alarm-1](/images/alarm_1.png?width=60pc)

4. Seleccionar las dimensiones `FunctionName, FunctionVersion, operation, service` y  seleccione la métrica `SuccessfulGetItem` creada en el ejercicio anterior.

![alarm-2](/images/alarm_2.png?width=60pc)
![alarm-3](/images/alarm_3.png?width=60pc)

5. Introduzca el valor umbral (**por ejemplo, 1**) ten el que desea que se supervisen los datos de la métrica. Observe que la opción **Estática** está seleccionada de forma predeterminada, lo que significa que estableceremos un valor estático como umbral que se va a monitorear.

6. Expanda **Configuración adicional**, donde puede indicar cuántas ocurrencias de la infracción califican para que se active la alarma. Establezca los valores en 1 de 5, lo que hará que la alarma se active si ha habido 1 infracción en 5 periodos de evaluación. Observe el mensaje en la parte superior del gráfico que describe el ajuste como **Esta alarma se activará cuando la línea azul vaya por encima de la línea roja por 1 puntos de datos en 25 minutos. **

7. Clic en **Siguiente**.

8. En la pantalla **Configurar las acciones**, puedes establecer qué acción quieres llevar a cabo cuando la alarma cambie a diferentes estados, como

    - `(En modo alarma) In alarm`
    - `(CORRECTO) OK`
    - `(Datos insuficientes) Insufficient data`

Las opciones disponibles para las acciones incluyen, - `(Notificación) Send a notification to an SNS topic` - `(Acciòn de Auto Scaling) Take an Auto scaling action` - `(Acción de EC2) EC2 action` si la métrica proviene de una instancia EC2

9. Seleccionar **Crear un tema nuevo** para crear un nuevo tema de SNS al que enviar la notificación y proporcionar tu dirección de correo electrónico.

![alarm-4](/images/alarm_4.png?width=50pc)

10. Nombrar el tema como `my_observability_topic`, ingrese su `e-mail` and haga clic en **Crear un tema**.
11. Clic en **Siguiente**.
12. Nombrar la alarma como `My Observability Alarm`.
13. Clic en **Siguiente**.

![alarm-4](/images/alarm_name.png?width=50pc)

14. Revisa tu configuración y haz clic en **Crear alarma**.
15. Abre tu bandeja de entrada de correo electrónico y confirma tu suscripción a temas de SNS 
![alarm-4](/images/alarm_confirm.png?width=50pc)


{{% notice warning %}}
Si no confirmas tu suscripción por correo electrónico, no recibirás ningún correo electrónico de notificación de las alarmas activadas. **Recuerda siempre revisar también tu carpeta de correo no deseado**.
{{% /notice %}}