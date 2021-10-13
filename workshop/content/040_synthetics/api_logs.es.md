+++
title = "API Canaries"
weight = 41
+++


Ir a la página de [Synthetics canary](https://console.aws.amazon.com/cloudwatch/home?#synthetics:canary/list), y hacer clic en **Crear canary**.

![synthetics-1](/images/synthetics1.png)

### Crear un API Canary

1. Seleccionar **API canary** bajo **(Proyecto) Blueprints**.
1. Nombrarlo como **my-api-canary**.
1. Revisar que la casilla de verificación  **I'm using an Amazon API Gateway API** esté activa.
1. Seleccionar la opción **Choose API and stage from API Gateway**.
1. Seleccionar la API **monitoring-app**.
1. Seleccionar la etapa **Prod**.

    La URL del API será automáticamente seleccionada.

    ![synthetics-2](/images/synthetics2.png)

1. Clic en **Add HTTP Request**.
1. Seleccionar **/items** bajo **Resource**.
1. Seleccionar **GET** bajo **Method**.
1. Aceptar todas las demás configuraciones por defecto y hacer clic en **Save**.

    ![synthetics-timer](/images/synthetics_http_request.png)
    ![synthetics-timer](/images/synthetics_http_request_1.png)

1. En (Programador) Schedule configurar para que se ejecute cada 1 minuto.

    ![synthetics-timer](/images/synthetics_timer.png)

1. Aceptar todas las demás configuraciones por defecto y hacer clic en **Crear canary**.

{{% notice tip %}}
Si no tomaste nota de la URL de su API después de implementar la aplicación de ejemplo, siempre puedes buscar la variable de salida del stack de CloudFormation o escribe el siguiente comando en la **terminal del ambiente de Cloud9**.
{{% /notice %}}

```sh
echo $(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
```

Después de algunos minutos, debería presentarse una pantalla similar para revisar el estado del Canary.
![synthetics-3](/images/synthetics3.png)

### Presentando fallos

Veamos: ¿qué pasa si rompemos accidentalmente nuestra API? Como estamos monitoreando el método GET para la ruta `/items/` , vamos a modificar la función Lambda  ***get-all-items.js*** para introducir una excepción aleatoria que haga que nuestro canary falle.

7. Regresa al **ambiente de Cloud9** y abre el archivo ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js***. Modifica el método `getAllItemsHandler()` lanzando un nuevo error justo después que se realice una validación del método HTTP:

```javascript
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
    }
    throw new Error('Sample exception introduction') // <- Sample exception throw 
```

8. Guarda los cambios en el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**El método getAllItemsHandler() debería verse como el que está a continuación:**
{{% expand "Fully modified method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }
        throw new Error('Sample exception introduction') // <- Sample exception throw 

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    return response
}
```
{{% /expand  %}}


#### Desplegando la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Validando el Canary

Después de unos minutos, deberías saber que tu canario está ahora en estado `Failed`.
 
![synthetics-4](/images/synthetics4.png)

Haz clic en el enlace **my-api-canary** para ver toda la información adicional sobre tu canary.

![synthetics-5](/images/synthetics5.png)

### Reparando el API Canary

#### Rebase del código de la aplicación

Para que podamos volver a pasar nuestras pruebas del canary, vamos a volver al **ambiente de Cloud9** y abrir el archivo  ***/serverless-observability-workshop/code/sample-app/src/handlers/get-all-items.js*** de nuevo. 

9. Ahora vamos a eliminar el error que acabamos de introducir modificando el controlador Lambda eliminando el comando `throw new Error()` que introdujimos en el método  `getAllItemsHandler()`:

```javascript
throw new Error('Sample exception introduction') // <- Remove exception throw 
```

10. Guardar los cambios en el archivo ***serverless-observability-workshop/code/sample-app-tracing/src/handlers/get-all-items.js***.

**El método getAllItemsHandler() debería verse como el que está a continuación:**
{{% expand "Fully modified method (expand for code)" %}}
```javascript
exports.getAllItemsHandler = async (event, context) => {
    let response
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`)
        }

        const items = await getAllItems()
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(items)
        }
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    return response
}
```
{{% /expand  %}}

#### Desplegando la aplicación

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
sam build && sam deploy
```

#### Validando el Canary

Después de unos minutos deberías notar que tu canario está de nuevo en estado `Passing`.

![synthetics-6](/images/synthetics6.png)
