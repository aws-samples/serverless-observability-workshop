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
                    if (resource.LogicalResourceId === 'getByIdFunction') functions.getByIdFunction = resource.PhysicalResourceId
                    if (resource.LogicalResourceId === 'putItemFunction') functions.putItemFunction = resource.PhysicalResourceId
                });
            }
        }
        catch (err) {
            throw new Error(err)
        }
        return functions
    }
}