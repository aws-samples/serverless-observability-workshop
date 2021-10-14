+++
title = "Desplegar la aplicación de ejemplo"
weight = 71
+++

En primer lugar, vamos a nuestra aplicación de muestra para este ejercicio.

{{% notice tip %}}
Dedica un par de minutos a comprender qué recursos se aprovisionan en el archivo  ***serverless-observability-workshop/code/sample-app-tracing/template.yaml*** f, así como sus funciones Lambda.
{{% /notice %}}

Con el fin de mostrar un ejemplo más completo de seguimiento activo, añadiremos un segundo enlace a nuestro servicio `Put Item` de manera que por cada nuevo elemento registrado, se enviará un mensaje a un tema de SNS que luego activará otra función Lambda para notificar a un administrador sobre este nuevo elemento inserción.

Después de implementar esta aplicación, se aprovisionarán los siguientes recursos en nuestra cuenta de AWS:

![Sample Architecture](/images/tracing_app.png?width=40pc)

### Desplegar la aplicación

1. Regresa al ambiente de **Cloud9** y navega a la aplicación de ejemplo en  ***serverless-observability-workshop/code/sample-app-tracing***

    **Opcional** - Si no puedes ejecutar `npm install` o `sam build` debido a un error de  `no space left on device`, es posible que requieras liberar espacio.

    ```sh
    # Look for uninstallable node_modules in our workspace to free disk space
    find ~/environment -type d -name 'node_modules' -prune | xargs rm -r
    ```

    A continuación, instala, complila y despliegua la aplicación

    ```sh
    # Install, Build and Deploy the application
    cd ~/environment/serverless-observability-workshop/code/sample-app-tracing
    npm install
    sam build
    sam deploy -g
    ```

1. Introduzce la siguiente configuración cuando se solicite:

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

1. Espera unos minutos y, a continuación, introduzca lo siguiente información cuando se pida de nuevo:

    ```sh
    Changeset created successfully. arn:aws:cloudformation:us-east-1:1234567890:changeSet/samcli-deploy135353414/3d893bb8-2ecf-4491-9022-0644f5534da


    Previewing CloudFormation changeset before deployment
    ======================================================
    Deploy this changeset? [y/N]: Y
    ```

1. Sigue [este deep link a CloudFormation](https://console.aws.amazon.com/cloudformation/home#/stacks?filteringText=sam-&filteringStatus=active&viewNested=true&hideStacks=false&stackId=) para ver el estado del despliegue del stack.

![Sample Architecture](/images/samstacks_tracing.png)

Espera hasta que ambos stacks completen su implementación y toma nota del (punto de enlace) endpoint de la URL del API para realizar pruebas posteriores.

![Sample Architecture](/images/samstackcomplete_tracing.png)

### Prueba de las APIs 

#### Exportar las variables de salida del stack

Para invocar nuestra API's, primero necesitamos obtener la variable de salida  `ApiUrl` que nos proporciona nuestro stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app-tracing --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

{{% notice warning %}}
Anota el (punto de enlace) endpoint de la URL de la API porque podría terminar siendo un requisito en un módulo posterior.
{{% /notice %}}


#### Probar la operación `Put Item`

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

#### Probar la operación `Get All Items`

```sh
curl -X GET $ApiUrl/items/ | jq
```

#### Probar la operación `Get Item by Id`

```sh
curl -X GET $ApiUrl/items/1 | jq
```