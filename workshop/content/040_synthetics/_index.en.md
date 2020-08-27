+++
title = "Synthetic Canaries"
chapter = true
weight = 40
+++

# Synthetic Canaries

You can use Amazon CloudWatch Synthetics to create canaries, configurable scripts that run on a schedule, to monitor your endpoints and APIs. Canaries follow the same routes and perform the same actions as a customer, which makes it possible for you to continually verify your customer experience even when you don’t have any customer traffic on your applications. By using canaries, you can discover issues before your customers do.

Canaries are Node.js scripts. They create Lambda functions in your account that use Node.js as a framework. Canaries can use the Puppeteer Node.js library to perform functions on your applications. Canaries work over HTTP and HTTPS protocols.

Canaries check the availability and latency of your endpoints and can store load time data and screenshots of the UI. They monitor your REST APIs, URLs, and website content, and they can check for unauthorized changes from phishing, code injection and cross-site scripting.

For a video demonstration of canaries, see the [Amazon CloudWatch Synthetics Demo video](https://www.youtube.com/watch?v=hF3NM9j-u7I).
