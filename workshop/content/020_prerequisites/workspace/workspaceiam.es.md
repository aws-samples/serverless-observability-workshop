---
title: "Actualizar las configuraciones de IAM tu Workspace"
chapter: false
weight: 18
---

{{% notice info %}}
Generalmente el Cloud9 gestiona las credenciales de IAM de manera dinámica. Para este workshop lo desactivaremos y, en su lugar, vamos a confiar en la función de IAM.
{{% /notice %}}

- Vuelve a tu workspace y haz clic en el ícono de engranaje (en la esquina superior derecha) o haz clic para abrir una nueva pestaña, enseguida elija "Open Preferences" 
- Selecciona **AWS SETTINGS**
- Desactiva **AWS managed temporary credentials**
- Cierra la pestaña
![c9disableiam](/images/c9disableiam.png)

Para garantizar que las credenciales temporales todavía no estén vigentes, también vamos a remover cualquier archivo de credenciales que ya existen:
```sh
rm -vf ${HOME}/.aws/credentials
```

Hay que configurar nuestro AWS CLI con nuestra región actual como preferencia. 

{{% notice info %}}
Si estás en [en un evento de AWS](../aws_event/), pregúntale a tu instructor qué región AWS **AWS region** debes utilizar.
{{% /notice %}}

```sh
export ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')
```

Verifica si AWS_REGION está definido como la región deseada. 
```sh
test -n "$AWS_REGION" && echo AWS_REGION is "$AWS_REGION" || echo AWS_REGION is not set
```
 
Lo salvaremos en bash_profile
```sh
echo "export ACCOUNT_ID=${ACCOUNT_ID}" | tee -a ~/.bash_profile
echo "export AWS_REGION=${AWS_REGION}" | tee -a ~/.bash_profile
aws configure set default.region ${AWS_REGION}
aws configure get default.region
```

### Validar la función de IAM

Utiliza el comando CLI [GetCallerIdentity](https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html) para confirmar si el IDE Cloud9 está usando la función correcta de IAM. 

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

El nombre del assumed-role de la salida debe contener:
{{< output >}}
serverless-observability-workshop-admin
{{< /output >}}

#### VÁLIDO

Si el _Arn_ contiene el nombre de la función arriba y una ID de instancia, puedes proseguir. 

{{< output >}}
{
    "Account": "123456789012",
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef",
    "Arn": "arn:aws:sts::123456789012:assumed-role/serverless-observability-workshop-admin/i-01234567890abcdef"
}
{{< /output >}}

#### INVÁLIDO

Si el _Arn_ contiene `TeamRole`, `MasterRole`, o no corresponde a la salida del nombre de la función arriba, <span style="color: red;">**NO PROCEDAS**</span>. Vuelve y confirma las etapas en esta página. 

{{< output >}}
{
    "Account": "123456789012",
    "UserId": "AROA1SAMPLEAWSIAMROLE:i-01234567890abcdef",
    "Arn": "arn:aws:sts::123456789012:assumed-role/TeamRole/MasterRole"
}
{{< /output >}}