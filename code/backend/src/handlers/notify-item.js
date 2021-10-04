const AWSXRay = require('aws-xray-sdk-core')
const { MetricUnit } = require('../lib/helper/models')
const { Unit } = require("aws-embedded-metrics")
const { logger_setup, putMetric, logMetric, logMetricEMF } = require('../lib/logging/logger')
let log

let _cold_start = true

exports.notifyNewItemHandler = async (event, context) => {
  return AWSXRay.captureAsyncFunc('## Handler', async (subsegment) => {
    log = logger_setup()
    let response

    log.info(event)
    log.info(context)

    try {
      if (_cold_start) {
        //Metrics
        await logMetricEMF(name = 'ColdStart', unit = Unit.Count, value = 1, { service: 'item_service', function_name: context.functionName })
        _cold_start = false
      }
     
      const record = JSON.parse(event.Records[0].Sns.Message)
      response = await getItem(record, subsegment)

      //Metrics
      await logMetricEMF(name = 'SuccessfulNewItemNotification', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'get-by-id' })
      //Tracing
      log.debug('Adding New Item Notification annotation')
      //subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'SUCCESS')
    } catch (err) {
      //Tracing
      log.debug('Adding New Item Notification annotation before raising error')
      //subsegment.addAnnotation('ItemID', id)
      subsegment.addAnnotation('Status', 'FAILED')
      //Logging
      log.error({ "operation": "notify-item", 'method': 'notifyNewItemHandler', "details": err })

      //Metrics
      await logMetricEMF(name = 'FailedGetNewItemNotification', unit = Unit.Count, value = 1, { service: 'item_service', operation: 'notify-item' })
    } finally {
      subsegment.close()
    }
    log.info({ operation: 'notify-item', 'method': 'notifyNewItemHandler', body: response })
    return response
  }, AWSXRay.getSegment());
}


const getItem = async (record, segment) => {
  return AWSXRay.captureAsyncFunc('## subscribeSNSNewItem', async (subsegment) => {
    let response
    try {
      response = JSON.stringify(record)

      //Logging
      log.info({ "operation": "notify-item", 'method': 'getItem', "details": response })
      log.debug('New user inserted with id')
    } catch (err) {
      log.error({ "operation": "notify-item", 'method': 'getItem', "details": err })
      throw err
    } finally {
      subsegment.close()
    }
    return response
  }, segment);
}
