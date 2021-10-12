+++
title = "Implementación del procesador de registros (Log Processor)"
weight = 11
+++

Para poder gestionar nuestras entradas de registro en segundo plano, necesitamos dos aplicaciones complementarias que podríamos crear nosotros mismos o implementar desde un SAR (Serverless Application Repository) ya proporcionado por un socio llamado Lumigo, que son responsables de la suscripción automática de grupos de registro específicos de CloudWatch a un cierto Kinesis Stream y otro que consume datos de este Stream, los analiza y los envía a CloudWatch Metrics. Estas apps se llaman  [SAR-Logging](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/auto-subscribe-log-group-to-arn) y [SAR-Async-Lambda-Metrics](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/async-custom-metrics).

{{% notice tip %}}
Dedique un par de minutos a comprender cómo se están implementando estas dos aplicaciones SAR examinando la plantilla SAM en ***serverless-observability-workshop/code/log-processing/template.yaml*** file.
{{% /notice %}}

Inspeccionando el archivo  ***serverless-observability-workshop/code/log-processing/template.yaml***, puedes  comprender los patrones que Amazon CloudWatch Logs intentará filtrar y enrutar a este módulo.

```yaml
# Only captures Custom Metrics and INFO|WARN|ERROR log events; reduces cost and unnecessary noise
FilterPattern:  "?INFO ?ERROR ?WARN ?REPORT ?MONITORING"
```

Además, inspeccionando los metodos `logMetric()` y `buildStatsDMetricData()` en el archivo ***serverless-observability-workshop/code/sample-app/src/lib*** , puedes comprender que la estructura de registro con la que comenzarán nuestras entradas de métricas **MONITORING**, que se filtrará junto con la entrada de registro **REPORT** de cada ejecución de función para capturar más puntos de datos operativos.

### Implementación de la utilidad de procesamiento de registros

1. Vuelve a tu entorno Cloud9 y abre una nueva terminal.

```sh
cd ~/environment/serverless-observability-workshop/code/log-processing
sam deploy -g
```

2. Introduzca la siguiente configuración cuando se le solicite:

```sh
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: log-processing
        AWS Region [us-east-1]: 
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: Y
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        Save arguments to samconfig.toml [Y/n]: Y 
```

3. Espere unos minutos hasta que se cree el conjunto de cambios y, a continuación, **(CANCELE) CANCEL** su implementación.

```sh 

Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy1597269838/0752490d-33a9-4995-ae17-4ccca3efbf5d


Previewing CloudFormation changeset before deployment
======================================================
Deploy this changeset? [y/N]: N
```

4. Editar el archivo ***serverless-observability-workshop/code/log-processing/samconfig.toml*** y modificar el parámetro `capabilities` para conceder permisos adicionales a CloudFormation para implementar recursos en su nombre:

```sh
capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND"
```

5. Guárdalo y ejecuta el comando `sam deploy` una vez más **sin utilizar** la opción **-g**. **Confirma** el despliegue y espere unos minutos hasta que finalice.

```sh
cd ~/environment/serverless-observability-workshop/code/log-processing
sam deploy
```

```sh 

Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy1597269838/0752490d-33a9-4995-ae17-4ccca3efbf5d


Previewing CloudFormation changeset before deployment
======================================================
Deploy this changeset? [y/N]: Y
```
