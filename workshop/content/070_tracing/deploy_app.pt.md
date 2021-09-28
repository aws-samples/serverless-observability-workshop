+++
title = "Implantar (deploy) o aplicativo de exemplo"
weight = 71
+++

Em primeiro lugar, vamos ao nosso aplicativo de amostra para este exercício.

{{% notice tip %}}
Reserve alguns minutos para entender quais recursos estão sendo provisionados no arquivo *** serverless-observability-workshop / code / sample-app-tracing / template.yaml ***, bem como suas funções Lambda.
{{% /notice %}}

Para mostrar um exemplo mais completo de rastreamento ativo no local, iremos adicionar um segundo link para o nosso serviço `Put Item` de forma que para cada novo item registrado, uma mensagem será enviada para um Tópico SNS que irá mais tarde, acione outra função do Lambda para notificar um administrador sobre a inserção deste novo item.

Depois de implantar este aplicativo, os seguintes recursos serão provisionados em nossa conta AWS:

![Sample Architecture](/images/tracing_app.png?width=40pc)

### Implantar (deploy) seu aplicativo

1. Volte para seu ambiente **Cloud9** e navegue no aplicativo de exemplo em ***serverless-observability-workshop/code/sample-app-tracing***

    **Opcional** - Se você não conseguir executar `npm install` ou` sam build` devido a um erro de `nenhum espaço deixado no dispositivo (no space left on device)`, você pode querer liberar algum espaço.

    ```sh
    # Look for uninstallable node_modules in our workspace to free disk space
    find ~/environment -type d -name 'node_modules' -prune | xargs rm -r
    ```

    Em seguida, instale, construa e implante o aplicativo

    ```sh
    # Install, Build and Deploy the application
    cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
    npm install
    sam build
    sam deploy -g
    ```

1. Insira as seguintes configurações quando solicitado:

    ```sh
            Setting default arguments for 'sam deploy'
            =========================================
            Stack Name [sam-app]: monitoring-app-tracing
            AWS Region [us-east-1]: 
            #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
            Confirm changes before deploy [y/N]: N
            #SAM needs permission to be able to create roles to connect to the resources in your template
            Allow SAM CLI IAM role creation [Y/n]: Y
            getAllItemsFunction may not have authorization defined, Is this okay? [y/N]: Y
            getByIdFunction may not have authorization defined, Is this okay? [y/N]: Y
            putItemFunction may not have authorization defined, Is this okay? [y/N]: Y
            Save arguments to samconfig.toml [Y/n]: Y 
    ```

1. Aguarde alguns minutos e digite o seguinte quando solicitado novamente:

    ```sh
    Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy135353414/3d893bb8-2ecf-4491-9022-0644f5534da


    Previewing CloudFormation changeset before deployment
    ======================================================
    Deploy this changeset? [y/N]: Y
    ```
1. Siga [este link direto para CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) para acompanhar a implantação da pilha.

![Arquitetura de referência](/images/samstacks_tracing.png)

Espere até que ambas as pilhas concluam sua implantação e anote o seu endpoint de URL de API para testes posteriores.

![Arquitetura de referência](/images/samstackcomplete_tracing.png)

### Teste as APIs

#### Exportar as variáveis de saída da pilha

Para invocar nossa API, primeiro precisamos buscar a variável de saída `ApiUrl` que nossa pilha CloudFormation nos fornece. Então, vamos iterar por meio de nossa pilha e exportar todas as variáveis de saída como variáveis de ambiente:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

{{% notice warning %}}
Anote o endpoint (URL) da API porque pode acabar sendo um requisito em um módulo posterior.
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