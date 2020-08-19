+++
title = "Create a Metric Alarms"
weight = 11
+++

A metric alarm watches a single CloudWatch metric or the result of a math expression based on CloudWatch metrics. The alarm performs one or more actions based on the value of the metric or expression relative to a threshold over a number of time periods. The action can be an Amazon EC2 action, an Amazon EC2 Auto Scaling action, or a notification sent to an Amazon SNS topic.

### Creating a Metric Alarm

Go to CloudWatch Alarms and click on Create alarm.

Go to your [CloudWatch Alarms Console](https://console.aws.amazon.com/cloudwatch/home?#alarmsV2:).

- Click on **Create Alarm**.
- Click **Select Metric**.
- This will take you to the Metrics home page, where you will see all the Namespaces available in the account. Select the **MonitoringApp** namespace

![alarm-1](/images/alarm_1.png?width=60pc)

- Select **FunctionName, FunctionVersion** dimension and select the **SuccessfulGetItem** metric we created in the previous exercise.

![alarm-2](/images/alarm_2.png?width=60pc)
![alarm-3](/images/alarm_3.png?width=60pc)

- Enter the threshold value (for example, 1) that you want the metric data to be monitored. Notice that **Static** option is selected by default, which means we will be setting a static value as the threshold to be monitored.

- Expand **Additional configuration** where you can indicate how many occurences of the breach qualifies for the alarm to be triggered. Set the values to 1 out of 5, which will make the alarm get triggered if there has been 1 breaches in 5 evaluation periods. Notice the message at the top of the graph describing the setting as **This alarm will trigger when the blue line goes above the red line for 1 datapoints within 25 minutes.**

- Click **Next**

- In the **Configure actions** screen, you can set what action you want to take when the alarm changes to different states such as

    - In alarm
    - OK
    - Insufficient data

The available options for actions include, - Send a notification to an SNS topic - Take an Auto scaling action - EC2 action if the metric is from an EC2 instance

Select **Create a new topic** to create a new SNS topic to send the notification to and provide your email address.

![alarm-4](/images/alarm_4.png?width=50pc)

