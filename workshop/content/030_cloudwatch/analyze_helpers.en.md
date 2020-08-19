+++
title = "Analyze Helper Functions"
weight = 31
+++

To ease some of the complexity of structuring the code to push metrics to CloudWatch, you'll find a lib folder under `/serverless-observability-workshop/code/sample-app/src/lib` containing some helper functions. Let's spend some time understanding two different ways we can publish metrics to CloudWatch.

{{% notice tip %}}
Spare a couple of minutes to understand the methods and enums created the `lib/logging/logger.js` and `lib/helper/models.js` files.
{{% /notice %}}

### Metric Units

When you are pushing metrics to CloudWatch Metrics, you have to define the unit of your metric in order for CloudWatch to properly aggregate your data. The Enum present on `lib/helper/models.js` gives you a full list of the possible unit options allowed by CloudWatch Metrics.

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

### Pushing Metrics To CloudWatch Metrics

Let us now navigate through the `lib/logging/logger.js` file containing methods to help you pushing your custom metrics to CloudWatch Metrics.

#### Pushing Metric Synchronously

The simplest way to push your metrics is by synchronously invoking the `putMetricData` method present in the AWS SDK and passing your metric object as a payload. The options parameter below receives an JSON object containing metric attributes and dimensions and parses it in a way that satisfies the `putMetricData` method needs by calling the `buildMetricData` helper function.

```javascript

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

#### Pushing Metric Asynchronously

However, it is important to take in consideration that creating Custom Metrics synchronously may impact on performance/execution time. For this reason, it is advisable to push your metrics asynchronously, which is accomplished by logging your metrics to **CloudWatch Logs** and then creating **subscription filters** that process these specific log entries and push them to CloudWatch Metrics in background. 

In order to log our metrics in a unique format that won't mess with the rest of our function logs, we are parsing our JSON object in the StatsD format.

```javascript

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
 * Transforms arguments into StatsD Metric Data. 
 *   
 * @property    {String}        SERVICE_NAME    Environment variable defining the service name to be used as metric dimension. This variable can be defined in the SAM template.
 * 
 * @param       {String}        name    Metric name. 
 * @param       {MetricUnit}    unit    Metric unit enum value (e.g. MetricUnit.Seconds). Metric units are available via MetricUnit Enum.
 * @param       {Number}        value   Metric value. 
 * @param       {Object}        options Dict containing metric dimensions and namespace. Optional. (e.g. {customer: customerId})
 *  
 * @returns     {String}        Custom Metric object. MONITORING|<metric_value>|<metric_unit>|<metric_name>|<namespace>|<dimensions>
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

