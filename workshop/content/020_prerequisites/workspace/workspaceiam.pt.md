---
title: "Atualizar as configurações do IAM para seu Workspace"
chapter: false
weight: 18
---

{{% notice info %}}
O Cloud9 normalmente gerencia as credenciais do IAM dinamicamente. Para este workshop, vamos desativá-lo e confiar na função do IAM em vez disso.
{{% /notice %}}

- Retorne ao seu workspace e clique no ícone de engrenagem (no canto superior direito) ou clique para abrir uma nova guia e escolha "Open Preferences"
- Selecione **AWS SETTINGS**
- Desligue **AWS managed temporary credentials**
- Feche a guia Preferences
![c9disableiam](/images/c9disableiam.png)

Para garantir que as credenciais temporárias ainda não estejam em vigor, também removeremos
qualquer arquivo de credenciais existente:
```sh
rm -vf ${HOME}/.aws/credentials
```

Devemos configurar nosso aws cli com nossa região atual como padrão.

{{% notice info %}}
Se você estiver [em um evento da AWS](../aws_event/), pergunte ao seu instrutor que **AWS region** usar.
{{% /notice %}}

```sh
export ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')
```

Verifique se AWS_REGION está definido como região desejada
```sh
test -n "$AWS_REGION" && echo AWS_REGION is "$AWS_REGION" || echo AWS_REGION is not set
```
 
Vamos salvá-los em bash_profile
```sh
echo "export ACCOUNT_ID=${ACCOUNT_ID}" | tee -a ~/.bash_profile
echo "export AWS_REGION=${AWS_REGION}" | tee -a ~/.bash_profile
aws configure set default.region ${AWS_REGION}
aws configure get default.region
```

### Validar a função do IAM

Use o commando CLI [GetCallerIdentity](https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html) para validar se o IDE Cloud9 está usando a função do IAM correta.

```
aws sts get-caller-identity

```

<!--
First, get the IAM role name from the AWS CLI.
```bash
INSTANCE_PROFILE_NAME=`basename $(aws ec2 describe-instances --filters Name=tag:Name,Values=aws-cloud9-${C9_PROJECT}-${C9_PID} | jq -r '.Reservations[0].Instances[0].IamInstanceProfile.Arn' | awk -F "/" "{print $2}")`
aws iam get-instance-profile --instance-profile-name $INSTANCE_PROFILE_NAME --query "InstanceProfile.Roles[0].RoleName" --output text
```
-->

O nome do assumed-role da saída deve conter:
{{< output >}}
serverless-observability-workshop-admin
{{< /output >}}

#### VALIDO

Se o _Arn_ contiver o nome da função acima e um ID de instância, você pode prosseguir.

{{< output >}}
{
    "Account": "123456789012",
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef",
    "Arn": "arn:aws:sts::123456789012:assumed-role/serverless-observability-workshop-admin/i-01234567890abcdef"
}
{{< /output >}}

#### INVALIDO

Se o _Arn contiver `TeamRole`, `MasterRole`, ou não corresponder à saída do nome da função acima, <span style="color: red;">**NÃO CONTINUAR**</span>. Volte e confirme as etapas nesta página.

{{< output >}}
{
    "Account": "123456789012",
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef",
    "Arn": "arn:aws:sts::123456789012:assumed-role/TeamRole/MasterRole"
}
{{< /output >}}