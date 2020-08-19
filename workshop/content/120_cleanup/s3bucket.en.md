---
title: "Delete the S3 Bucket"
chapter: false
weight: 72
---

#### Empty the S3 Bucket

```sh
aws s3 rm s3://serverless-wksp-sample-<your-name> --recursive
```

#### Delete the S3 Bucket

```sh
aws s3 rb s3://serverless-wksp-sample-<your-name> --force
```
