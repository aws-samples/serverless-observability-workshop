+++
title = "Analyze Logs in the Console"
weight = 53
+++

Go to your [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/home).

- Under **Logs**, click **Log Groups**.
- Check the **Exact match** box, and type the prefix of your Stack, **sam-app** in our case.
- You should see all available Log Groups for our Lambda functions. 
- Click in the one that contains **GetAllItemsFunction** on its name.

![metrics-1](/images/log_producer_1.png)

- Click in the latest Log Stream.

![metrics-2](/images/log_producer_2.png)

You should be able to  see something like the print screen below containing at least three log entries: Two for the context and event objects, a tentative error log in case of any failures, and a final one regarding the result of the function execution.
 
- Expand and navigate through the payload generated for each entry. Notice that the additional metadata that we added in our helper lib are present for each entry.

![metrics-3](/images/log_producer_3.png)

