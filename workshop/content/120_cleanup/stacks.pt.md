---
title: "Excluir as pilhas do CloudFormation"
chapter: false
weight: 71
---

#### Exclua a pilha do nosso aplicativo de exemplo

```sh
aws cloudformation delete-stack --stack-name monitoring-app
```

#### Exclua a pilha do processamento de logs

Se você completou o módulo: `CloudWatch Metrics, Alarms, and Dashboards > Pushing Metrics Asynchronously`:

```sh
aws cloudformation delete-stack --stack-name log-processing
```

#### Exclua a pilha do tracing distribuido

Se você completou o módulo: `Distributed Tracing` :

```sh
aws cloudformation delete-stack --stack-name monitoring-app-tracing
```

#### Exclua a pilha do CloudWatch Dashboard com metricas (baseado em CDK)

Se você completou o módulo: `CloudWatch Metrics, Alarms, and Dashboards > Creating Dashboards` module:

```sh
aws cloudformation delete-stack --stack-name CloudwatchCdkStack
```

Certifique-se de atualizar até que suas pilhas sejam excluídas para avançar.