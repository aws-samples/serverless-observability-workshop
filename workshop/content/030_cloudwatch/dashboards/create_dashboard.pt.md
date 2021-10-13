+++
title = "Criar um Painel"
weight = 11
+++

Para demonstrar maneiras de automatizar e criar painéis flexíveis e reutilizáveis, implantaremos um modelo CDK para criar nossos painéis com base nas métricas criadas anteriormente para nosso aplicativo de amostra.

### Implantar o modelo de painel pela CDK

Volte para o seu ambiente Cloud9 e abra um novo terminal.

**Opcional** - Se você não conseguir executar `npm install` ou `cdk deploy` devido a um erro de `nenhum espaço deixado no dispositivo`, você pode precisar liberar algum espaço.

```sh
# Look for uninstallable node_modules in our workspace to free disk space
find ~/environment -type d -name 'node_modules' -prune | xargs rm -r
```

Em seguida, instale, construa e implante o aplicativo

```sh
# Install, Build and Deploy the application
cd ~/environment/serverless-observability-workshop/code/cloudwatch-cdk
npm outdated
npm update --force
npm install --force
npm install -g typescript aws-cdk
cdk deploy -c stack_name=monitoring-app
```

{{% notice tip %}}
Reserve alguns minutos para entender como esses dois aplicativos SAR estão sendo implantados, examinando o modelo SAM no arquivo ***serverless-observability-workshop/code/cloudwatch-cdk/lib/cloudwatch-cdk-stack.ts***.
{{% /notice %}}

Vá para o seu [CloudWatch Dashboard Console](https://console.aws.amazon.com/cloudwatch/home?#dashboards:).

![dashboard-1](/images/dashboard_1.png)

Este projeto CDK cria dois painéis baseados em vários widgets com diferentes representações (Linhas e Números) para demonstrar as diferentes possibilidades de monitorar a saúde de sua aplicação.

Um painel operacional para métricas úteis em SysOps.

![dashboard-2](/images/dashboard_2.png)

E também um Business Dashboard para acompanhar as métricas relacionadas aos negócios.

![dashboard-3](/images/dashboard_3.png)

