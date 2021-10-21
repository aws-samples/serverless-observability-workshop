+++
title = "Probando la aplicación"
weight = 12
+++

#### Exportar las variables de salida del stack

Para invocar nuestro API, necesitamos recuperar la salida de la variable `ApiUrl` dada por el stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Probar la operación `Put Item`

```sh
curl -X POST \
  $ApiUrl/items/ \
  -d '{
        "id":"3",  
        "name": "Sample third item"
  }'
```
