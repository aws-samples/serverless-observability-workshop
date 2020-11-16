+++
title = "Querying Logs"
weight = 61
+++

### Using Logs Insights queries

Go to [CloudWatch Logs Insights console](https://console.aws.amazon.com/cloudwatch/home?#logsV2:logs-insights) and select the `/aws/lambda/monitoring-app-getAllItemsFunction` log group. Remember, you can select more than one log group if needed. As of Aug 2020, you can select up to 20 log groups at a time.

![metrics-1](/images/query_logs_1.png)

As you can see a sample query is automatically placed in the query field. 

Now simply click on **Run query** button to execute the query results. As expected, you will see results from the query.

The sample query fetches the `@timestamp` and `@message` fields from the log data, orders by the timestamp field in descending order and displays the first 20 records.

![metrics-1](/images/query_logs_2.png)

#### Querying API Gateway Custom Access Logging

You can also switch your log group preference to the `/aws/apigateway/` log group in order to query for access logs of our API, while maintaining the same query statement.

![metrics-1](/images/query_logs_api.png)

{{% notice tip %}}
Learn more about Logs Insights syntax and queries [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html)
{{% /notice %}}


#### Simple list with filter and sort 

Select once again the `/aws/lambda/monitoring-app-getAllItemsFunction` log group.

Now paste this query into the log field. The following query applies a filter on the messages and fetches only the records that contain the string `operation` in the log event and displays the result ordered by the timestamp field in descending order

```sql
fields @timestamp, @message
| sort @timestamp desc
| limit 20
| filter @message like /operation/
```

![metrics-1](/images/query_logs_3.png)

#### List with aggregation, sort and timeseries

Now paste this query into the log field. The following shows a result that contains the number of messages captured by 5 minute interval

```sql
fields @timestamp, @message
| stats count(@message) as number_of_events by bin(5m)
| filter @message like /operation/
| limit 20
```

![metrics-1](/images/query_logs_4.png)

You can also visualize the results by clicking on the `Visualization` tab in the results area as shown below.

![metrics-1](/images/query_logs_5.png)

Notice that you can also add the visualization to a `CloudWatch Dashboard`, export to csv and so on.

![metrics-1](/images/query_logs_6.png)

### Querying using AWS CLI

You can query the log groups using AWS CLI as well. The query below queries top 10 log records from a log group for a specific time period.

Make sure you replace the log group to the appropriate one you have on your account and change the start and end time parameter values to the right epoch time values. You can calculate epoch time values from this public website - https://www.epochconverter.com/

{{% notice tip %}}
For simplicity reasons, the timestamps below are set between `24th Aug, 2020` to `24th Aug, 2022`.
{{% /notice %}}

```sh
export getAllItemsFunction=$(aws cloudformation describe-stack-resources --stack-name monitoring-app --output json | jq '.StackResources[] | select(.LogicalResourceId=="getAllItemsFunction") | .PhysicalResourceId' | sed -e 's/^"//'  -e 's/"$//')
aws logs start-query --log-group-name /aws/lambda/$getAllItemsFunction --start-time '1598288209' --end-time '1661364126' --query-string 'fields @message | limit 10'
```

The above query will return a queryId. Copy that query Id and replace the `<QUERY_ID>` string. in the below command and execute it to see log data results.

```sh
aws logs get-query-results --query-id <QUERY_ID>
```
