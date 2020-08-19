const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const cloudwatch = new AWS.CloudWatch()
const log = require('lambda-log')
const MetricUnit = require('../helper/models')

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
    log.options.debug = process.env.ENABLE_DEBUG !== undefined ? process.env.ENABLE_DEBUG : false
    log.options.dynamicMeta = function (message) {
        return {
            timestamp: new Date().toISOString()
        }
    }
    return log
}

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
 * Logs Custom Metric on CloudWatch Logs in JSON format. 
 * 
 * Since creating Custom Metrics synchronously may impact on performance/execution time,
 * logging a metric to CloudWatch Logs allows us to pick them up asynchronously
 * and create them as a metric in an external process
 * leaving the actual business function compute time to its logic only.
 *  
 * By default, it has a namespace with the app name and it adds service name as a dimension, 
 * and any additional {key: value} arg. 
 * It takes up to 9 dimensions that will be used to further categorize a custom metric, besides the service dimension
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
        const metric = buildMetricData(name, unit, value, options)
        log.info(metric)
    } catch (err) {
        log.error({ operation: options.operation !== undefined ? options.operation : 'undefined_operation', method: 'logMetric', details: err })
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
