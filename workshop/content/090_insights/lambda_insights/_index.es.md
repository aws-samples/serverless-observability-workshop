+++
title = "Lambda Insights"
chapter = true
weight = 91
+++

# Lambda Insights

CloudWatch Lambda Insights es una solución de supervisión y solución de problemas para aplicaciones serverless que se ejecutan en AWS Lambda. La solución recopila, agrega y resume métricas a nivel del sistema, incluidos el tiempo de CPU, la memoria, el disco y la red. También recopila, agrega y resume información de diagnóstico, como los arranques en frío y los apagados de los trabajadores de Lambda, para ayudarle a aislar los problemas de las funciones de Lambda y resolverlos rápidamente.

Lambda Insights utiliza una nueva extensión Lambda de CloudWatch, que se proporciona como capa Lambda. Al instalar esta extensión en una función de Lambda, recopila métricas a nivel del sistema y emite un único evento de registro de rendimiento por cada invocación de esa función de Lambda. CloudWatch utiliza el formato métrico integrado para extraer métricas de los eventos de registro. Para mayor información sobre Lambda extensions, revisa [Usando AWS Lambda extensions](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-extensions-in-preview/?nc1=b_rp). Para mayor información sobre embedded metric format, revisa [Ingesting High-Cardinality Logs and Generating Metrics with CloudWatch Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html).

# Importante

Aunque este módulo está diseñado para ser completamente independiente sin depender de la finalización del módulo anterior, se recomienda encarecidamente implementar las funciones del [Rastreo distribuido](../../070_tracing).
