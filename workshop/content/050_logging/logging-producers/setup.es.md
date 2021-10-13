+++
title = "Analizando la (librería de registro) Logger Library"
weight = 52
+++

Para ayudarnos a imprimir nuestros registros de forma estructurada en CloudWatch Logs, utilizaremos el módulo NPM [lambda-log](https://www.npmjs.com/package/lambda-log) que ya registra nuestras entradas de registro como un JSON estructurado y también nos permite definir metadatos y atributos adicionales para enriquecer nuestros registros y realizar más análisis y correlaciones. Para aliviar parte de la complejidad de configurar el módulo en nuestro código, encontrarás una carpeta de librerías en ***/serverless-observability-workshop/code/sample-app/src/lib*** que contiene algunas funciones auxiliares listas para ser importadas en nuestras funciones de Lambda. 

{{% notice tip %}}
Dese un par de minutos para comprender los métodos creados en el archivo  ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js***
{{% /notice %}}

### (Librería de registro) Logger Library

Ahora vamos a navegar por el archivo ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** que contiene el método `logger_setup()` para ayudarnos a iniciar la biblioteca de registro dentro de nuestras funciones Lambda.

La forma en que está configurado actualmente, añadirá adicionalmente una marca de tiempo y los `X-Ray Tracing IDs` para los segmentos raíz y padre, en caso de que `Active Tracing` esté habilitado en nuestro código. Esto puede resultar útil si alguna vez necesitamos consultar una transacción específica que ha fallado en toda la cadena de microservicios, pudiendo consultar por su ID de seguimiento raíz. 

Dependiendo de si activamos o no los niveles de `Debug` en la plantilla SAM `template.yaml` SAM template, podemos activar/desactivar las entradas `log.debug()` para registrarlas en CloudWatch Logs.
 
```javascript
const log = require('lambda-log')
/**
 * Prepares logger class to be used across methods.
 * 
 * This setup evaluates the need of enabling debug entries 
 * and also adds a timestamp to all log entries as custom metadata. 
 * 
 * @property    {String}    ENABLE_DEBUG    Toggles debug mode on/off for printing debug entires on CloudWatch Logs. This variable can be defined in the SAM template.
 *  
 * @returns     {LambdaLog} Logger class.
 */
exports.logger_setup = () => {
    const tracingInfo = process.env._X_AMZN_TRACE_ID || '';
    const TRACE_ID_REGEX = /^Root=(.+);Parent=(.+);/;
    const matches = tracingInfo.match(TRACE_ID_REGEX) || ['', '', ''];
    
    log.options.debug = process.env.ENABLE_DEBUG !== undefined ? process.env.ENABLE_DEBUG : false
    log.options.dynamicMeta = message => {
        return {
            timestamp: new Date().toISOString(),
            'X-Amzn-Trace-Id': tracingInfo,
            'X-Amzn-Trace-Id-Root': matches[1],
            'X-Amzn-Trace-Id-Parent': matches[2]
        }
    }
    return log
}
```
