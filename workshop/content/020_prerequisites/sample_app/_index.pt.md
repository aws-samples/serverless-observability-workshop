+++
title = "Deploy da aplicação de exemplo"
weight = 20
+++

### Clonar o Repositório do GitHub

```sh
cd ~/environment
git clone https://github.com/aws-samples/serverless-observability-workshop.git
cd serverless-observability-workshop/code/sample-app
```

{{% notice tip %}}
Poupe alguns minutos para entender quais recursos estão sendo provisionados no arquivo `serverless-observability-workshop/code/sample-app/template.yaml`, bem como suas funções do Lambda.
{{% /notice %}}

Depois de implantar este aplicativo, os seguintes recursos serão provisionados em nossa conta da AWS:

![Sample Architecture](/images/architecture.png?width=40pc)

### Implantando seu aplicativo

Instalar, criar e implantar o aplicativo

```sh
# Install, Build and Deploy the application
cd ~/environment/serverless-observability-workshop/code/sample-app
npm install
sam build
sam deploy -g
```

Insira as seguintes configurações quando solicitado:

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

Siga [este deep link para o CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) para acompanhar a implantação da stack.

![Sample Architecture](/images/samstacks.png)

Aguarde até que ambas as stacks concluam sua implantação e tome nota do endpoint da URL da API para testes posteriores.

![Sample Architecture](/images/samstackcomplete.png)

### Teste as APIs

#### Exportar as variáveis de saída da stack

Para invocar nossas APIs, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa stack do CloudFormation nos fornece. Então, vamos iterar através de nossa stack e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

{{% notice warning %}}
Observe o endpoint da URL da API porque ele pode acabar sendo um requisito em um módulo posterior.
{{% /notice %}}


#### Teste a operação `Put Item`

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

#### Teste a operação `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Teste a operação `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/1 | jq
```
