+++
title = "Analizar funciones auxiliares"
weight = 31
+++

Para aliviar parte de la complejidad de estructurar el código para enviar métricas a CloudWatch, encontrarás una carpeta de librerías en ***/serverless-observability-workshop/code/sample-app/src/lib*** que contiene algunas funciones auxiliares. Dediquemos algo de tiempo a comprender dos formas diferentes de publicar métricas en CloudWatch.

{{% notice tip %}}
Dese un par de minutos para comprender los métodos y enumeraciones que se crearon en los archivos ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js*** and ***/serverless-observability-workshop/code/sample-app/src/lib/helper/models.js***.
{{% /notice %}}

### Unidades métricas

Cuando se envía métricas a CloudWatch Metrics, tiene que definir la unidad de la métrica para que CloudWatch agregue correctamente sus datos. El Enum presente en ***/serverless-observability-workshop/code/sample-app/src/lib/helper/models.js*** le ofrece una lista completa de las posibles opciones de unidades permitidas por CloudWatch Metrics.

**Puedes visualizar toda la lista de unidades ampliando la sección siguiente.**

{{% expand "Full Enum object (expand for code)" %}}
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

### Enviando métricas a CloudWatch Metrics

Ahora vamos a navegar por el archivo  ***/serverless-observability-workshop/code/sample-app/src/lib/logging/logger.js***  que contiene métodos que le ayudarán a llevar sus métricas personalizadas a CloudWatch Metrics.

#### Enviando métricas síncronamente

La forma más sencilla de impulsar las métricas es invocar de forma sincrónica el método `putMetricData()` presente en el SDK de AWS y pasar el objeto de métrica como carga útil. El siguiente parámetro options recibe un objeto JSON que contiene atributos y dimensiones de métricas y lo analiza de forma que satisfaga las necesidades del método `putMetricData()` llamando a la función auxiliar  `buildMetricData()`.

**Puedes visualizar toda la lista de unidades ampliando la sección siguiente.**

{{% expand "Full helper functions (expand for code)" %}}
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
 * Puts metric to count the number of successful item retrievals using default dimensions and namespace.
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

#### Enviando métricas asíncronamente

Sin embargo, es importante tener en cuenta que la creación de métricas personalizadas de forma sincrónica puede afectar al rendimiento y al tiempo de ejecución. Por este motivo, es recomendable impulsar sus métricas de forma asíncrona, lo que se logra registrando sus métricas en `CloudWatch Logs` y luego creando `(filtros de suscripción) subscription filters` que procesan estas entradas de registro específicas y las llevan a CloudWatch Metrics en segundo plano.

In order to log our metrics in a unique format that won't mess with the rest of our function logs, we are parsing our JSON object in the StatsD format. Once our payload is formed, we use the `logMetric()` method to log them to CloudWatch Logs.

**Puedes visualizar todas las funciones auxiliares ampliando la sección siguiente**

{{% expand "Full helper functions (expand for code)" %}}
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
 * Logs metric to count the number of successful item retrievals using default dimensions and namespace.
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
 * Logs metric to count the number of successful item retrievals using default dimensions and namespace.
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

#### Enviando métricas utilizando Embedded Metric Format (EMF)

Con el fin de aprovechar EMF para enviar métricas a CloudWatch a través de un registro estructurado, podemos seguir varios enfoques de implementación como se describe en el [Repositorio GitHub de AWS Embedded Metric Format](https://github.com/awslabs/aws-embedded-metrics-node).

**Puedes visualizar toda la lista de unidades ampliando la sección siguiente.**

{{% expand "Full helper functions (expand for code)" %}}
```javascript
/**
 * Logs Custom Metric on CloudWatch Metrics using Embedded Metric Format (EMF).
 *   
 * @example
 * Logs metric to count the number of successful item retrievals using default dimensions and namespace.
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
        log.debug(`Logging custom metric ${name} via Embedded Metric Format (EMF)`)
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
