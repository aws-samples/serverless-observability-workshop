---
title: "Métricas asíncronas utilizando Embedded Metrics Format (EMF)"
chapter: true
weight: 34
---

En el ejercicio anterior, aprendimos a enviar métricas de forma síncrona mediante el SDK de AWS. Sin embargo, ese enfoque, por ser síncrono, acaba consumiendo recursos de nuestras funciones Lambda en términos de latencia adicional (alrededor de 60 ms por llamada de servicio) y consumo de memoria, lo que puede dar lugar a ejecuciones más caras y lentas. 

Para superar esta sobrecarga, podemos adoptar una estrategia asíncrona para crear estas métricas. Esta estrategia consiste en imprimir las métricas en un formato estructurado o semiestructurado como registros en Amazon CloudWatch Logs y disponer de un mecanismo de procesamiento en segundo plano de estas entradas en función de un patrón de filtro que coincida con la misma entrada que se imprimió.

# Embedded Metric Format

En noviembre de 2019, AWS publicó `Embedded Metric Format (EMF)` para permitir a los clientes generar métricas personalizadas de forma asíncrona de forma nativa en forma de registros escritos en CloudWatch Logs. En este módulo entenderemos cómo se compara el CEM y se diferencia del enfoque que hicimos en el módulo anterior. Utilizaremos el método `logMetricEMF` proporcionado en nuestra lib utils. Vamos a modificar las funciónes Lambda getAlItems y getItemById  para entender este nuevo comportamiento. 

El formato métrico integrado de CloudWatch le permite ingerir datos complejos de aplicaciones de alta cardinalidad en forma de registros y generar métricas procesables a partir de ellos. Puede integrar métricas personalizadas junto con datos detallados de eventos de registro, y CloudWatch extrae automáticamente las métricas personalizadas para que pueda visualizarlas y alarmarlas, para detectar incidentes en tiempo real. Además, los eventos de registro detallados asociados con las métricas extraídas se pueden consultar mediante CloudWatch Logs Insights para proporcionar información detallada sobre las causas fundamentales de los eventos operativos.

Embedded metric format le ayuda a generar métricas personalizadas procesables a partir de recursos efímeros como funciones y contenedores de Lambda. Al utilizar el formato métrico integrado para enviar registros desde estos recursos efímeros, ahora puede crear fácilmente métricas personalizadas sin tener que instrumentar o mantener código separado, a la vez que obtiene potentes capacidades analíticas en sus datos de registro.

Al usar el formato de métrica incrustado, puedes generar tus registros mediante una biblioteca cliente. Alternativamente, puede crear manualmente los registros y enviarlos mediante el API `PutLogEvents` o el agente de CloudWatch.

{{% notice tip %}}
Puedes aprender más sobre [Embedded Metric Format (EMF)](https://aws.amazon.com/about-aws/whats-new/2019/11/amazon-cloudwatch-launches-embedded-metric-format/) y sobre como [Usar las librerías cliente para generar Embedded Metric Format Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Libraries.html) going through our documentation.
{{% /notice %}}