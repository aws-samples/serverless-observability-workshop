/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace SampleAppPT;
public class Function
{
    private static HttpClient? _httpClient;

    /// <summary>
    ///     Default constructor that Lambda will invoke.
    /// </summary>
    public Function()
    {
        _httpClient = new HttpClient();
            AWSSDKHandler.RegisterXRayForAllServices();
    }

    /// <summary>
    ///     Test constructor
    /// </summary>
    public Function(HttpClient httpClient)   
    {
        _httpClient = httpClient;
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

        Logger.LogInformation("Getting ip address from external service");
        
        var watch = Stopwatch.StartNew();
        var location = await GetCallingIp().ConfigureAwait(false);
        watch.Stop();
        
        var lookupRecord = new LookupRecord(requestContextRequestId,
            "Hello AWS Lambda Powertools for .NET", location, (int)watch.ElapsedMilliseconds);

        Logger.LogInformation("Logging lookup record");
        Logger.AppendKeys((IEnumerable<KeyValuePair<string, object>>)lookupRecord);

        Logger.LogInformation("Logging lookup record with structured log and custom keys");



        return new APIGatewayProxyResponse
        {
            Body = JsonSerializer.Serialize(lookupRecord),
            StatusCode = 200,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }

    /// <summary>
    ///  Calls location api to return IP address
    /// </summary>
    /// <returns>IP address string</returns>
    private static async Task<string?> GetCallingIp()
    {
        if (_httpClient == null) return "0.0.0.0";
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "AWS Lambda .Net Client");

        try
        {
            Logger.LogInformation("Calling Check IP API");

            var response = await _httpClient.GetStringAsync("https://checkip.amazonaws.com/").ConfigureAwait(false);
            var ip = response.Replace("\n", "");

            Logger.LogInformation($"API response returned {ip}");

            return ip;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw;
        }
    }
}

/// <summary>
///  LookupRecord class represents the data structure of location lookup
/// </summary>
[Serializable]
public class LookupRecord
{
    public LookupRecord()
    {
    }

    /// <summary>
    /// Create new LookupRecord
    /// </summary>
    /// <param name="lookupId">Id of the lookup</param>
    /// <param name="greeting">Greeting phrase</param>
    /// <param name="ipAddress">IP address</param>
    /// <param name="requestExecutionTime">Lookup execution time</param>
    public LookupRecord(string? lookupId, string? greeting, string? ipAddress, int requestExecutionTime)
    {
        LookupId = lookupId;
        Greeting = greeting;
        IpAddress = ipAddress;
        RequestExecutionTime = requestExecutionTime;
    }
    
    public string? LookupId { get; set; }
    public string? Greeting { get; set; }
    public string? IpAddress { get; set; }
    public int RequestExecutionTime { get; set; }
}

