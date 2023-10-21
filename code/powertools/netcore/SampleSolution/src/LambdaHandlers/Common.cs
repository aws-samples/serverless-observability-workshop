using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.APIGatewayEvents;
using AWS.Lambda.Powertools.Tracing;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Repositories;

public static class Common
{
    private static readonly HttpClient client = new HttpClient();

    public static void Initialize(out ServiceProvider serviceProvider)
    {
        Console.WriteLine("Setting up the DI container");

        var serviceCollection = new ServiceCollection();
        serviceCollection.AddLogging();

        string region = Environment.GetEnvironmentVariable("AWS_REGION") ?? RegionEndpoint.USEast2.SystemName;
        serviceCollection.AddSingleton<IAmazonDynamoDB>(new AmazonDynamoDBClient(RegionEndpoint.GetBySystemName(region)))
                        .AddScoped<IDynamoDBContext, DynamoDBContext>()
                        .AddScoped<IItemRepository, ItemRepository>();
        serviceProvider = serviceCollection.BuildServiceProvider();
    }

    public static APIGatewayProxyResponse APIResponse(HttpStatusCode httpStatusCode, string body)
    {
        var response = new APIGatewayProxyResponse
        {
            StatusCode = (int)httpStatusCode,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
        if (!string.IsNullOrEmpty(body)) response.Body = body;

        return response;
    }

    [Tracing(CaptureMode = TracingCaptureMode.Disabled)]
    public static async Task<string> GetCallingIP()
    {
        try
        {
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Add("User-Agent", "AWS Lambda .Net Client");

            var msg = await client.GetStringAsync("http://checkip.amazonaws.com/").ConfigureAwait(continueOnCapturedContext: false);

            return msg.Replace("\n", "");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            throw;
        }
    }
}