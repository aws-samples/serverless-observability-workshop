const AWS = require('aws-sdk')
import { CloudFormation } from 'aws-sdk';

export class CloudFormationHelper {
    cfn_parser = async (stack_name: string = '') => {
        let functions: any = {}
        try {
            const cfn = new CloudFormation()
            const data = await cfn.describeStackResources({ StackName: stack_name }).promise()
            if (data.StackResources) {
                data.StackResources.forEach(resource => {
                    if (resource.LogicalResourceId === 'getAllItemsFunction') functions.getAllItemsFunction = resource.PhysicalResourceId
                    if (resource.LogicalResourceId === 'GetAllItemsLogGroup') functions.getAllItemsLogGroup = String(resource.PhysicalResourceId).replace("/aws/lambda/","")
                    if (resource.LogicalResourceId === 'getByIdFunction') functions.getByIdFunction = resource.PhysicalResourceId
                    if (resource.LogicalResourceId === 'GetByIdLogGroup') functions.getByIdLogGroup = String(resource.PhysicalResourceId).replace("/aws/lambda/","")
                    if (resource.LogicalResourceId === 'putItemFunction') functions.putItemFunction = resource.PhysicalResourceId
                    if (resource.LogicalResourceId === 'PutItemLogGroup') functions.putItemLogGroup = String(resource.PhysicalResourceId).replace("/aws/lambda/","")
                });
            }
        }
        catch (err) {
            throw new Error(err)
        }
        return functions
    }
}