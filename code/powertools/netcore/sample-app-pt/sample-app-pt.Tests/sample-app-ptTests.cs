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
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.TestUtilities;
using Moq;
using Moq.Protected;
using Xunit.Abstractions;

namespace SampleAppPT.Tests;

public class SampleAppPTTests
{
    private readonly ITestOutputHelper _testOutputHelper;

    public SampleAppPTTests(ITestOutputHelper testOutputHelper)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact]
    public async Task TestSampleAppPTFunctionHandler()
    {
        // Arrange
        var requestId = Guid.NewGuid().ToString("D");
        var accountId = Guid.NewGuid().ToString("D");
        var location = "192.158. 1.38";

        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(location)
            })
            .Verifiable();

        var request = new APIGatewayProxyRequest
        {
            RequestContext = new APIGatewayProxyRequest.ProxyRequestContext
            {
                RequestId = requestId,
                AccountId = accountId
            }
        };
        
        var context = new TestLambdaContext
        {
            FunctionName = "Cookiecutter-SampleAppPTFunction-Gg8rhPwO7Wa1",
            FunctionVersion = "1",
            MemoryLimitInMB = 215,
            AwsRequestId = Guid.NewGuid().ToString("D")
        };
        
        var body = new Dictionary<string, string>
        {
            { "LookupId", requestId },
            { "Greeting", "Hello AWS Lambda Powertools for .NET" },
            { "IpAddress", location },
        };

        var expectedResponse = new APIGatewayProxyResponse
        {
            Body = JsonSerializer.Serialize(body),
            StatusCode = 200,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };

        var function = new Function(new HttpClient(handlerMock.Object));
        var response = await function.FunctionHandler(request, context);

        _testOutputHelper.WriteLine("Lambda Response: \n" + response.Body);
        _testOutputHelper.WriteLine("Expected Response: \n" + expectedResponse.Body);

        Assert.Equal(expectedResponse.Body, response.Body);
        Assert.Equal(expectedResponse.Headers, response.Headers);
        Assert.Equal(expectedResponse.StatusCode, response.StatusCode);
    }
}

