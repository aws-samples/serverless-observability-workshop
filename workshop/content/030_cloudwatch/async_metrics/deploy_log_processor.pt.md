+++
title = "Implantar o Processador de Log"
weight = 11
+++

Para que possamos lidar com nossas entradas de log em segundo plano, precisamos de dois aplicativos complementares que podemos construir por nós mesmos ou implantar a partir de um SAR (Serverless Application Repository) já fornecido por um parceiro chamado Lumigo, que é responsável pela assinatura automática de um grupo específico do CloudWatch Log para um determinado fluxo do Kinesis e outro que consome dados deste fluxo, os analisa e envia para o CloudWatch Metrics. Esses aplicativos são chamados de [SAR-Logging](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/auto-subscribe-log-group-to-arn) e [SAR-Async-Lambda-Metrics](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:374852340823:applications/async-custom-metrics).

{{% notice tip %}}
Reserve alguns minutos para entender como esses dois aplicativos SAR estão sendo implantados, examinando o modelo SAM em ***serverless-observability-workshop/code/log-processing/template.yaml*** file.
{{% /notice %}}

Ao inspecionar o arquivo ***serverless-observability-workshop/code/log-processing/template.yaml***, você pode entender os padrões que o Amazon CloudWatch Logs tentará filtrar e rotear para este módulo.

```yaml
# Only captures Custom Metrics and INFO|WARN|ERROR log events; reduces cost and unnecessary noise
FilterPattern:  "?INFO ?ERROR ?WARN ?REPORT ?MONITORING"
```

Além disso, inspecionando os métodos `logMetric()` e `buildStatsDMetricData()` no arquivo ***serverless-observability-workshop/code/sample-app/src/lib***, você pode entender que a estrutura de log que nosso entradas métricas começarão com **MONITORING**, que será filtrado junto com a entrada de registro **REPORT** de cada execução de função para capturar mais pontos de dados operacionais.

### Implantar o utilitário de processamento de log

1. Volte para o seu ambiente Cloud9 e abra um novo terminal.

```sh
cd ~/environment/serverless-observability-workshop/code/log-processing
sam deploy -g
```

2. Insira as seguintes configurações quando solicitado:

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

3. Aguarde alguns minutos até que o changeset seja criado e, em seguida, **CANCELE** sua implantação.

```sh 

Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy1597269838/0752490d-33a9-4995-ae17-4ccca3efbf5d


Previewing CloudFormation changeset before deployment
======================================================
Deploy this changeset? [y/N]: N
```

4. Edite o arquivo ***serverless-observability-workshop/code/log-processing/samconfig.toml*** e modifique o parâmetro `resources` para dar permissões adicionais aos recursos de implantação do CloudFormation em seu nome:

```sh
capabilities = "CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND"
```

5. Salve-o e execute o comando `sam deploy` mais uma vez **sem** a opção **- g**. **Confirme** a implantação e aguarde alguns minutos até que seja concluída.

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
