+++
title = "Desencadenando una alarma"
weight = 12
+++

Vuelve rápidamente a tu terminal de `Cloud9` y haz un llamado al API `GetItemByID`. 

### Exportar las variables de salida del stack

Para invocar nuestro API, necesitamos recuperar la salida de la variable `ApiUrl` dada por el stack de CloudFormation. Así que vamos a iterar a través de nuestro stack y exportar todas las variables de salida como variables de entorno:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Probar la operación `Get Item By ID`

```sh
curl -X GET $ApiUrl/items/1 | jq
```

### Navegación por la pantalla Alarmas

Una vez que haya creado la alarma, notará que la alarma está ahora en estado `(Datos insuficientes) Insufficient data` s, lo que indica que no hay datos suficientes para validar la alarma. Esperar 5 minutos cambiará el estado de alarma a `OK` en verde o `In alarm` en rojo.

![alarm-5](/images/alarm_5.png)

Recibirás un correo electrónico poco después del primer período de recopilación de datos.

![alarm-6](/images/alarm_6.png)
