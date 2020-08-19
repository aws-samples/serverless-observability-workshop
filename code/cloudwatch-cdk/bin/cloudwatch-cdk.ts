#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudwatchCdkStack } from '../lib/cloudwatch-cdk-stack';
import { CloudFormationHelper } from '../lib/helper/cloudformation-parser';

(async () => {
    const app = new cdk.App();
    const monitoringStackName = app.node.tryGetContext('stack_name')
    if (!monitoringStackName) {
        console.log("****************************************************");
        console.log("ERROR: your AWS SAM backend CloudFormation stack_name is undefined.\n");
        console.log("Please run the command like this:");
        console.log("cdk [synth|deploy|destroy] -c stack_name=<your SAM stack name>");
        console.log("****************************************************");
        process.exit(1);
    }
    const functions = await new CloudFormationHelper().cfn_parser(monitoringStackName)
    new CloudwatchCdkStack(app, 'CloudwatchCdkStack', { functions: functions });
})()
