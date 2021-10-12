+++
title = "Triggering an Alarm"
weight = 12
+++

Quickly jump back to your `Cloud9` terminal and call your `GetItemByID` API. 

### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

### Test the `Get Item By ID` operation

```sh
curl -X GET $ApiUrl/items/1 | jq
```

### Navigating the Alarms screen

Once you have created the alarm, you will notice that the alarm is now in `Insufficient data` state which indicates that there is not enough data to validate the alarm. Waiting for 5 minutes will change the alarm state to `OK` in green or `In alarm` in red.

![alarm-5](/images/alarm_5.png)

You should receive an e-mail shortly after the first period of data collection.

![alarm-6](/images/alarm_6.png)
