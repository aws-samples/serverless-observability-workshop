using System;
using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Repositories;

public static class Common
{

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
}