+++
title = "Crear un Dashboard (Panel)"
weight = 11
+++

Para demostrar las formas en que puedes automatizar y crear dashboards (paneles) flexibles y reutilizables, implementaremos una plantilla de CDK para crear nuestros paneles basándonos en las métricas creadas anteriormente para nuestra aplicación de muestra.

### Desplegar la plantilla de CDK para Dashboard

Vuelve a tu entorno Cloud9 y abre una nueva terminal.

**Opcional** - Si no puedes ejecutar `npm install` o `cdk deploy` debido al error `no space left on device`, es posible que requieras liberar espacio.

```sh
# Look for uninstallable node_modules in our workspace to free disk space
find ~/environment -type d -name 'node_modules' -prune | xargs rm -r
```

A continuación, instala, complila e implementa la aplicación

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
Dedique un par de minutos a comprender cómo se están implementando estas dos aplicaciones SAR examinando la plantilla SAM en el archivo ***serverless-observability-workshop/code/cloudwatch-cdk/lib/cloudwatch-cdk-stack.ts***
{{% /notice %}}

Ir a la [Consola de CloudWatch Dashboard (Páneles) ](https://console.aws.amazon.com/cloudwatch/home?#dashboards:).

![dashboard-1](/images/dashboard_1.png)

Este proyecto de CDK crea dos cuadros de mando basados en varios widgets con diferentes representaciones (líneas y números) para demostrar las distintas posibilidades que se pueden monitorear el estado de su aplicación. 

Un dashboard (panel) operativo para métricas relacionadas con SysoPS.

![dashboard-2](/images/dashboard_2.png)

Y también un Dashboard (panel) de negocio para mantenerse al día con las métricas relacionadas con la empresa.

![dashboard-3](/images/dashboard_3.png)

