---
title: "Eliminar Stacks de CloudFormation"
chapter: false
weight: 71
---

#### Eliminar el stack de la aplicación de ejemplo

```sh
aws cloudformation delete-stack --stack-name monitoring-app
```

#### Eliminar el stack de procesamiento de registro

Si has realizado el módulo de `CloudWatch Métricas, Alarmas y Dashboards > Enviar métricas de forma asincrónica`:

```sh
aws cloudformation delete-stack --stack-name log-processing
```

#### Eliminar el stack de trazas distribuídas

Si has realizado el módulo de `Trazas distribuidas`:

```sh
aws cloudformation delete-stack --stack-name monitoring-app-tracing
```

#### Eliminar el stack para el (Panel) Dashboard de métricas de CW basado en CDK

If you completed the `CloudWatch Metrics, Alarms, and Dashboards > Creating Dashboards` module:

```sh
aws cloudformation delete-stack --stack-name CloudwatchCdkStack
```

Asegúrate de actualizar hasta que se eliminen tus stacks para seguir adelante.