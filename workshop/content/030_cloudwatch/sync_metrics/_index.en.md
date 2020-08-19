---
title: "Pushing Metrics Synchronously"
chapter: true
weight: 32
---

# Pushing Metrics Synchronously

It's time to push our first metrics to CloudWatch. Let's start by pushing them synchronously by using the `putMetric` method provided in our utils lib. We are going to modify both PutItem and GetAllItems Lambda functions to understand its behaviors.
