using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Amazon.XRay.Recorder.Handlers.AwsSdk;
using AWS.Lambda.Powertools.Logging;

namespace SampleAppPT;
public class GetAllItems
{
    /// <summary>
    ///     Default constructor that Lambda will invoke.
    /// </summary>
    public GetAllItems()
    {
        AWSSDKHandler.RegisterXRayForAllServices();
    }

    /// <summary>
    ///     Lambda Handler
    /// </summary>
    /// <param name="apigwProxyEvent">API Gateway Proxy event</param>
    /// <param name="context">AWS Lambda context</param>
    /// <returns>API Gateway Proxy response</returns>
    [Logging(LogEvent = true)]
    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigwProxyEvent, ILambdaContext context)
    {

        var requestContextRequestId = apigwProxyEvent.RequestContext.RequestId;


        return new APIGatewayProxyResponse
        {
            Body = JsonSerializer.Serialize(""),
            StatusCode = 200,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}