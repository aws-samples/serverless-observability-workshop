+++
title = "Despliegue de la aplicación de ejemplo"
weight = 20
+++

### Clonar el depósito del GitHub 

```sh
cd ~/environment
git clone https://github.com/aws-samples/serverless-observability-workshop.git
cd serverless-observability-workshop/code/sample-app
```

{{% notice tip %}}
Toma unos minutos para comprender cuáles recursos están provistos en el archivo `serverless-observability-workshop/code/sample-app/template.yaml` así como sus funciones de Lambda. 
{{% /notice %}}

Después de implantar esta aplicación, serán provistos los siguientes recursos en nuestra cuenta de AWS:

![Sample Architecture](/images/architecture.png?width=40pc)

### Desplegando tu aplicación

Instalar, crear e implantar la aplicación

```sh
# Install, Build and Deploy the application
cd ~/environment/serverless-observability-workshop/code/sample-app
npm install
sam build
sam deploy -g
```

Inserta las configuraciones a seguir cuando sea solicitado:

```sh
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: monitoring-app
        AWS Region [us-east-1]: <YOUR AWS_REGION>
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: N
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        getAllItemsFunction may not have authorization defined, Is this okay? [y/N]: Y
        getByIdFunction may not have authorization defined, Is this okay? [y/N]: Y
        putItemFunction may not have authorization defined, Is this okay? [y/N]: Y
        Save arguments to configuration file [Y/n]: Y
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]: 

```

Sigue este [deep link a CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) para acompañar la implantación de la stack.

![Sample Architecture](/images/samstacks.png)

Espera hasta que ambas stacks finalicen su despliegue y toma nota del endpoint de la URL de la API para pruebas posteriores.

![Sample Architecture](/images/samstackcomplete.png)

### Probar las APIs

#### Exportar las variables de salida de stack

Para invocar nuestras APIs, en primer lugar es necesario buscar la variable de salida `ApiUrl` que nuestra stack de CloudFormation nos presenta. Así que vamos a iterar a través de nuestra stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

{{% notice warning %}}
Observa el endpoint de la URL de API porque puede ser un requisito en algún módulo posteriormente. 
{{% /notice %}}


#### Prueba la operación `Put Item`

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"1",  
        "name": "Sample test item"
  }'

curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"2",  
        "name": "Second test item"
  }'
```

#### Prueba la operación `Get All Items` 

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Prueba la operación `Get Item by Id` 

```sh
curl -X GET $ApiUrl/items/1 | jq
```
