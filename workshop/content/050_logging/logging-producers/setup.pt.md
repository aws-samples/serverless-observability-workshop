+++
title = "Analisando a biblioteca Logger"
weight = 52
+++

Para nos ajudar a imprimir nossos logs de uma forma estruturada no CloudWatch Logs, usaremos o módulo NPM [lambda-log](https://www.npmjs.com/package/lambda-log), que já registra nossas entradas de log como um JSON estruturado e também nos permite definir metadados e atributos adicionais para enriquecer nossos logs para análises e correlações adicionais. Para facilitar um pouco a complexidade da configuração do módulo em nosso código, você encontrará uma pasta lib em ***/serverless-observability-workshop/code/sample-app/src/lib*** contendo algumas funções auxiliares prontas a ser importado em nossas funções Lambda.

{{% notice tip %}}
Reserve alguns minutos para entender os métodos criados no arquivo ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js***.
{{% /notice %}}

### Biblioteca de Logger

Vamos agora navegar pelo arquivo ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** contendo o método `logger_setup()` para nos ajudar a iniciar a biblioteca de registro dentro de nossas funções Lambda.

A forma como está configurada atualmente, será colocado adicionando um carimbo (timestamp) de data/hora e os `X-Ray Tracing IDs` para os segmentos raiz e segmento pai, no caso de `Active Tracing` estar habilitado em nosso código. Isso pode ser útil se precisarmos consultar uma transação específica que falhou em toda a cadeia de microsserviços, sendo capaz de consultar por seu ID de rastreamento de raiz.

Dependendo se habilitamos ou não os níveis `Debug` em nosso modelo SAM `template.yaml`, podemos ligar / desligar as entradas `log.debug()` para serem registradas nos Logs do CloudWatch.
 
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
