import * as cdk from '@aws-cdk/core'
import cloudwatch = require('@aws-cdk/aws-cloudwatch')
import { GraphWidget, SingleValueWidget, Metric, DimensionHash } from '@aws-cdk/aws-cloudwatch'
import { CloudFormationHelper } from './helper/cloudformation-parser'

export interface MyStackProps extends cdk.StackProps {
  functions?: any;
}

export class CloudwatchCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: MyStackProps = {}) {
    super(scope, id, props);

    const operationalDashboard = new cloudwatch.Dashboard(this, 'MonitoringApp-Operational-Dashboard', { dashboardName: 'MonitoringApp-Operational-Dashboard' })
    operationalDashboard.addWidgets(
      this.buildSingleValueWidget('Get All Items -- Operational Metrics', 'monitoring-getAllItemsFunction-1OFYBMQ0CWM1D'),
      this.buildSingleValueWidget('Get Item By ID -- Operational Metrics', 'monitoring-getByIdFunction-PJDC795HE5YP'),
      this.buildSingleValueWidget('Put Item -- Operational Metrics', 'monitoring-putItemFunction-U6EIYZDPS5B5'),
    );

    const businessDashboard = new cloudwatch.Dashboard(this, 'MonitoringApp-Business-Dashboard', { dashboardName: 'MonitoringApp-Business-Dashboard' })
    businessDashboard.addWidgets(
      this.buildGraphWidget('Item Service - Business Metrics', props.functions)
    );
  }

  // Example with Graph Widget
  buildGraphWidget(widgetName: string, functions: any = {}): GraphWidget {
    return new GraphWidget({
      title: widgetName,
      height: 6,
      width: 24,
      left: [
        this.buildMetric('MonitoringApp', 'Sucessful Item Registrations', functions.putItemFunction, 'SuccessfulPutItem', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.putItemFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'put-item' }),
        this.buildMetric('MonitoringApp', 'Failed Item Registrations', functions.putItemFunction, 'FailedPutItem', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.putItemFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'put-item' }),
        this.buildMetric('MonitoringApp', 'Sucessful ItemByID Retrievals', functions.getByIdFunction, 'SuccessfulGetItem', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.getByIdFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'get-by-id' }),
        this.buildMetric('MonitoringApp', 'Failed ItemByID Retrievals', functions.getByIdFunction, 'FailedGetItem', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.getByIdFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'get-by-id' }),
        this.buildMetric('MonitoringApp', 'Sucessful Items Retrievals', functions.getAllItemsFunction, 'SuccessfulGetAllItems', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.getAllItemsFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'get-all-items' }),
        this.buildMetric('MonitoringApp', 'Failed Items Retrievals', functions.getAllItemsFunction, 'FailedGetAllItems', 'sum', cdk.Duration.minutes(1), { FunctionName: functions.getAllItemsFunction, FunctionVersion: '$LATEST', service: 'item_service', operation: 'get-all-items' })
      ]
    })
  }

  // Example with Number Widget
  buildSingleValueWidget(widgetName: string, functionName: string = ''): SingleValueWidget {
    return new SingleValueWidget({
      title: widgetName,
      height: 6,
      width: 24,
      metrics: [
        this.buildMetric('MonitoringApp', '# of ColdStarts', functionName, 'ColdStart', 'sum', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST', service: 'item_service', function_name: functionName }),
        this.buildMetric('AWS/Lambda', 'ColdStart Duration', functionName, 'InitDuration', 'avg', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST' }),
        this.buildMetric('AWS/Lambda', 'Billed Duration', functionName, 'BilledDuration', 'avg', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST' }),
        this.buildMetric('AWS/Lambda', 'Memory Size', functionName, 'MemorySize', 'avg', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST' }),
        this.buildMetric('AWS/Lambda', 'Memory Used', functionName, 'MemoryUsed', 'avg', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST' }),
        this.buildMetric('AWS/Lambda', 'Estimated Cost ($)', functionName, 'EstimatedCost', 'sum', cdk.Duration.hours(1), { FunctionName: functionName, FunctionVersion: '$LATEST' })
      ]
    })
  }

  buildMetric(namespace: string, label: string, functionName: string, metricName: string, statistic: string, period: cdk.Duration, dimensions: DimensionHash): Metric {
    return new Metric({
      namespace: namespace,
      metricName: metricName,
      period: period,
      dimensions: dimensions,
      label: label,
      statistic: statistic
    })
  }
}
