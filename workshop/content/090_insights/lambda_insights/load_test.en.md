+++
title = "Load Testing the Application"
weight = 92
+++

In order to see how our application withstands traffic peaks, we are going to use [Locust](https://locust.io/) to load test our 3 APIs simultaneously. For this test, we are to emulate the access of **250 concurrent users during 10 minutes** spawning users at a **rate of 10 users/sec**

#### Export the stack output variables

To invoke our API's, we first need to fetch the `ApiUrl` output variable that our CloudFormation stack gives us. So let us iterate through our stack and export all output variables as environment variables:

```sh
export ApiUrl=$(aws cloudformation describe-stacks --stack-name monitoring-app --output json | jq '.Stacks[].Outputs[] | select(.OutputKey=="ApiUrl") | .OutputValue' | sed -e 's/^"//'  -e 's/"$//')
echo "export ApiUrl="$ApiUrl
```

#### Run the Load Test

In your **Cloud9** environment, run the following:

```sh
cd ~/environment/serverless-observability-workshop/code/sample-app
locust -f locust-script.py -H ${ApiUrl} --headless -u 250 -r 10 -t 10m
```

{{% notice warning %}}
Remember that this test is going to take **10 minutes** to complete. 
{{% /notice %}}

After its completion you should see you terminal with an output like the following:

![Lambda Insights](/images/li_2.png)

Did you notice that the `/POST` operation presented no errors and maintained its latency relatively low while the two other `/GET` operations presented a really elevated error rate and overall latency?. In the next step, we will try to understand why.
