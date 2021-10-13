+++
title = "Funções auxiliares de Análise"
weight = 31
+++

Para facilitar um pouco da complexidade da estruturação do código para enviar métricas para CloudWatch, você encontrará uma pasta lib em ***/serverless-observability-workshop/code/sample-app/src/lib*** ccontendo algumas funções auxiliares. Vamos passar algum tempo entendendo duas maneiras diferentes de publicar métricas no CloudWatch.

{{% notice tip %}}
Reserve alguns minutos para entender os métodos e enums que criaram os arquivos ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** e ***/serverless-observability-workshop/code/sample-app/src/lib/helper/models.js***.
{{% /notice %}}

### Unidades de Métricas

Quando você está enviando métricas para CloudWatch Metrics, você tem que definir a unidade de sua métrica para que o CloudWatch agregue adequadamente seus dados. O Enum presente em ***/serverless-observability-workshop/code/sample-app/src/lib/helper/models.js*** fornece uma lista completa das opções de unidade possíveis permitidas pelo CloudWatch Metrics.

**Você pode visualizar toda a lista de unidades expandindo a seção abaixo**

{{% expand "Objeto Enum completo (expandir para o código)" %}}
```javascript
/**
   * Enum CloudWatch Metric unit.
   * @readonly
   * @enum {String}
   */
  exports.MetricUnit = Object.freeze({
    Seconds: 'Seconds',
    Microseconds: 'Microseconds',
    Milliseconds: 'Milliseconds',
    Bytes: 'Bytes',
    Kilobytes: 'Kilobytes',
    Megabytes: 'Megabytes',
    Gigabytes: 'Gigabytes',
    Terabytes: 'Terabytes',
    Bits: 'Bits',
    Kilobits: 'Kilobits',
    Megabits: 'Megabits',
    Gigabits: 'Gigabits',
    Terabits: 'Terabits',
    Percent: 'Percent',
    Count: 'Count',
    BytesPerSecond: 'Second',
    KilobytesPerSecond: 'Second',
    MegabytesPerSecond: 'Second',
    GigabytesPerSecond: 'Second',
    TerabytesPerSecond: 'Second',
    BitsPerSecond: 'Second',
    KilobitsPerSecond: 'Second',
    MegabitsPerSecond: 'Second',
    GigabitsPerSecond: 'Second',
    TerabitsPerSecond: 'Second',
    CountPerSecond: 'Second'
  })
```
{{% /expand  %}}

### Publicando Métricas para o CloudWatch Metrics

Vamos agora navegar pelo arquivo ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** contendo métodos para ajudá-lo a enviar suas métricas personalizadas para CloudWatch Metrics.

#### Publicando Métricas de forma síncrona

A maneira mais simples de publicar suas métricas é invocando de forma síncrona o método `putMetricData()` presente no SDK da AWS e passando seu objeto de métrica como um payload. O parâmetro de opções abaixo recebe um objeto JSON contendo atributos e dimensões das métricas e o analisa de uma forma que satisfaça o método `putMetricData()` necessário para a chamada da função de ajuda `buildMetricData()`.

**Você pode visualizar todas as funções auxiliares expandindo a seção abaixo**

{{% expand "Funções auxiliares completas (expandir para o código)" %}}
```javascript
/**
 * Puts Custom Metric on CloudWatch Metrics. 
 * 
 * This method puts a custom metric on CloudWatch Metrics during the Lambda
 * execution time. It is important to take in consideration that
 * creating Custom Metrics synchronously may impact on performance/execution time
 *  
 * By default, it has a namespace with the app name and it adds service name as a dimension, and any 
 * additional {key: value} arg. 
 * It takes up to 9 dimensions that will be used to further categorize a custom metric, besides the service dimension
 * 
 * @example
 * Puts metric to count the number of successful item retrievals using default dimensions and namepsace.
 * putMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1)
 * // Dimensions created: {service: 'service_undefined'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Puts metric to count the number of successful item retrievals per service & operation in the default namespace.
 * putMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id' })
 * // Dimensions created: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Puts metric to count the number of successful item retrievals per service & operation in a custom namespace.
 * putMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id', namespace: 'MySampleApp' })
 * // Dimensions created: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MySampleApp
 * 
 * @param   {String}        name    Metric name. 
 * @param   {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via MetricUnit Enum. Default to Count.
 * @param   {Number}        value   Metric value. Default to 0.
 * @param   {Object}        options Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 */
exports.putMetric = async (name, unit = MetricUnit.Count, value = 0, options) => {
    try {
        log.debug(`Creating custom metric ${name}`)
        const metric = buildMetricData(name, unit, value, options)
        await cloudwatch.putMetricData(metric).promise()
    } catch (err) {
        log.error({ operation: options.operation !== undefined ? options.operation : 'undefined_operation', method: 'putMetric', details: err })
        throw err
    }
}

/**
 * Transforms arguments into CloudWatch Metric Data. 
 *   
 * @property    {String}        SERVICE_NAME    Environment variable defining the service name to be used as metric dimension. This variable can be defined in the SAM template.
 * 
 * @param       {String}        name    Metric name. 
 * @param       {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via MetricUnit Enum.
 * @param       {Number}        value   Metric value. 
 * @param       {Object}        options Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 *  
 * @returns     {Object}        Custom Metric object.
 */
const buildMetricData = (name, unit, value, options) => {
    let namespace = 'MonitoringApp',
        service = process.env.SERVICE_NAME !== undefined ? process.env.SERVICE_NAME : 'service_undefined'

    if (options) {
        if (options.namespace !== undefined) namespace = options.namespace
        if (options.service !== undefined) service = options.service
        delete options.namespace
        delete options.service
    }

    const metric = {
        MetricData: [
            {
                MetricName: name,
                Dimensions: buildDimensions(service, options),
                Timestamp: new Date(),
                Unit: unit,
                Value: value
            },
        ],
        Namespace: namespace
    };
    return metric
}

/**
 * Builds correct format for custom metric dimensions from args.
 *  
 * CloudWatch accepts a max of 10 dimensions per metric
 * we include service name as a dimension
 * so we take up to 9 values as additional dimensions
 * before we return our dimensions array
 * 
 * @param   {JSON}  service             Service dimension. (e.g. {service: 'value'}) 
 * @param   {JSON}  extra_dimensions    Extra metric dimensions and. Optional. (e.g. {customer: customerId})
 * 
 * @returns {Array} Dimensions in the form of [{Name: 'dim1', Value: 'val1'}, {Name: 'dim10', Value: 'val10'}]  
 */
const buildDimensions = (service, extra_dimensions) => {
    let dimensions = [{ Name: 'service', Value: service }]
    if (extra_dimensions) {
        Object.keys(extra_dimensions).forEach(k => {
            dimensions.push({ Name: k, Value: extra_dimensions[k] })
        });
        dimensions = dimensions.slice(0, 10)
    }
    return dimensions
}
```
{{% /expand  %}}

#### Publicando Métricas de forma assíncrona

No entanto, é importante levar em consideração que a criação de métricas personalizadas de forma síncrona pode impactar no desempenho/tempo de execução. Por esse motivo, é aconselhável enviar suas métricas de forma assíncrona, o que é conseguido registrando suas métricas para o `CloudWatch Logs` e então criando `subscription filters` que processam essas entradas de logs específicas e envia-las para o CloudWatch Metrics por baixo dos panos. 

Para registrar nossas métricas em um formato exclusivo que não atrapalhe o restante de nossos registros de funções, estamos analisando nosso objeto JSON no formato StatsD. Uma vez que nossa carga útil é formada, usamos o método `logMetric()` para envia-los ao CloudWatch Logs.

**Você pode visualizar todas as funções auxiliares expandindo a seção abaixo**

{{% expand "Funções auxiliares completas (expandir para o código)" %}}
```javascript
/**
 * Logs Custom Metric on CloudWatch Logs in JSON format. 
 * 
 * Since creating Custom Metrics synchronously may impact on performance/execution time,
 * logging a metric to CloudWatch Logs allows us to pick them up asynchronously
 * and create them as a metric in an external process
 * leaving the actual business function compute time to its logic only.
 *  
 * By default, it has a namespace with the app name and it adds service name as a dimension, 
 * and any additional {key: value} arg. 
 * It takes up to 9 dimensions that will be used to further categorize a custom metric, besides the service dimension.
 * 
 * It uses standard console.log() instead of log.info() to output the metric to CloudWatch Logs
 * because the processing application is designed with a RegEx based on default loggers. 
 * 
 * @example
 * Logs metric to count the number of successful item retrievals using default dimensions and namepsace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1)
 * // Dimensions included: {service: 'service_undefined'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in the default namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in a custom namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id', namespace: 'MySampleApp' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MySampleApp
 * 
 * @param   {String}        name    Metric name. 
 * @param   {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via MetricUnit Enum. Default to Count.
 * @param   {Number}        value   Metric value. Default to 0.
 * @param   {Object}        options Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 */
exports.logMetric = (name, unit = MetricUnit.Count, value = 0, options) => {
    try {
        log.debug(`Logging custom metric ${name} for async processing`)
        const metric = buildStatsDMetricData(name, unit, value, options)
        console.log(metric)
    } catch (err) {
        log.error({ operation: options.operation !== undefined ? options.operation : 'undefined_operation', method: 'logMetric', details: err })
        throw err
    }
}

/**
 * Logs Custom Metric on CloudWatch Logs in JSON format. 
 * 
 * Since creating Custom Metrics synchronously may impact on performance/execution time,
 * logging a metric to CloudWatch Logs allows us to pick them up asynchronously
 * and create them as a metric in an external process
 * leaving the actual business function compute time to its logic only.
 *  
 * By default, it has a namespace with the app name and it adds service name as a dimension, 
 * and any additional {key: value} arg. 
 * It takes up to 9 dimensions that will be used to further categorize a custom metric, besides the service dimension.
 * 
 * It uses standard console.log() instead of log.info() to output the metric to CloudWatch Logs
 * because the processing application is designed with a RegEx based on default loggers. 
 * 
 * @example
 * Logs metric to count the number of successful item retrievals using default dimensions and namepsace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1)
 * // Dimensions included: {service: 'service_undefined'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in the default namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in a custom namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id', namespace: 'MySampleApp' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MySampleApp
 * 
 * @param   {String}        name    Metric name. 
 * @param   {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via MetricUnit Enum. Default to Count.
 * @param   {Number}        value   Metric value. Default to 0.
 * @param   {Object}        options Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 */
const buildStatsDMetricData = (name, unit, value, options) => {
    let namespace = 'MonitoringApp',
        service = process.env.SERVICE_NAME !== undefined ? process.env.SERVICE_NAME : 'service_undefined'

    if (options) {
        if (options.namespace !== undefined) namespace = options.namespace
        if (options.service !== undefined) service = options.service
        delete options.namespace
        delete options.service
    }

    return `MONITORING|${value}|${unit}|${name}|${namespace}|${buildDimensionsStatsDFormat(service, options)}`
}

/**
 * Builds correct format for StatsD custom metric dimensions from args.
 *  
 * CloudWatch accepts a max of 10 dimensions per metric
 * we include service name as a dimension
 * so we take up to 9 values as additional dimensions
 * before we return our dimensions array
 * 
 * @param   {JSON}  service             Service dimension. (e.g. {service: 'value'}) 
 * @param   {JSON}  extra_dimensions    Extra metric dimensions and. Optional. (e.g. {customer: customerId})
 * 
 * @returns {String} Dimensions in the form of "service=my_service,dimension=value"
 */
const buildDimensionsStatsDFormat = (service, extra_dimensions) => {
    let dimensions = `service=${service}`
    if (extra_dimensions) {
        Object.keys(extra_dimensions).slice(0, 9).forEach(k => {
            dimensions = `${dimensions},${k}=${extra_dimensions[k]}`
        });
    }
    return dimensions
}
```
{{% /expand  %}}

#### Publicando Métricas usando o formato de métrica incorporado (Embedded Metric Format - EMF)

A fim de aproveitar EMF para enviar métricas para CloudWatch por meio de log estruturado, podemos seguir várias abordagens de implementação, conforme descrito no [Repositório GitHub do AWS Embedded Metric Format](https://github.com/awslabs/aws-embedded-metrics-node).

**Você pode visualizar todas as funções auxiliares expandindo a seção abaixo**

{{% expand "Funções auxiliares completas (expandir para o código)" %}}
```javascript
/**
 * Logs Custom Metric on CloudWatch Metrics using Embedded Metric Format (EMF).
 *   
 * @example
 * Logs metric to count the number of successful item retrievals using default dimensions and namepsace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1)
 * // Dimensions included: {service: 'service_undefined'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in the default namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MonitoringApp
 * 
 * @example
 * Logs metric to count the number of successful item retrievals per service & operation in a custom namespace.
 * logMetric(name = 'SuccessfulGetItem', unit = MetricUnit.Count, value = 1, { service: 'item_service', operation: 'get-item-by-id', namespace: 'MySampleApp' })
 * // Dimensions included: {service: 'item_service', operation: 'get-item-by-id'} 
 * // Namespace used: MySampleApp
 * 
 * @property    {String}    AWS_EMF_NAMESPACE    Environment variable defining the service name to be used as metric namespace. This variable can be defined in the SAM template.
 * 
 * @param   {String}        name    Metric name. 
 * @param   {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via Unit Enum. Default to Count.
 * @param   {Number}        value   Metric value. Default to 0.
 * @param   {Object}        dimensions Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 */
exports.logMetricEMF = async (name, unit = Unit.Count, value = 0, dimensions) => {
    try {
        const metrics = createMetricsLogger()
        metrics.putDimensions(buildEMFDimensions(dimensions))
        metrics.putMetric(name, value, unit)
        metrics.setNamespace(process.env.AWS_EMF_NAMESPACE !== undefined ? process.env.AWS_EMF_NAMESPACE : 'aws-embedded-metrics')
        log.debug(`Logging custom metric ${name} via Embbeded Metric Format (EMF)`)
        log.debug(metrics)
        await metrics.flush()
    } catch (err) {
        log.error({ operation: dimensions.operation !== undefined ? options.dimensions : 'undefined_operation', method: 'logMetricEMF', details: err })
        throw err
    }
}

/**
 * Transforms arguments into dimensions to EMF. 
 *   
 * @property    {String}        SERVICE_NAME    Environment variable defining the service name to be used as metric dimension. This variable can be defined in the SAM template.
 * 
 * @param       {Object}        dimensions Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 *  
 * @returns     {Object}        Custom Dimensions object.
 */
const buildEMFDimensions = (dimensions) => {
    let service = process.env.SERVICE_NAME !== undefined ? process.env.SERVICE_NAME : 'service_undefined'

    if (dimensions) {
        if (dimensions.service !== undefined) service = dimensions.service
        delete dimensions.namespace
        delete dimensions.service
    }

    return dimensions
}
```
{{% /expand  %}}