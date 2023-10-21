using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using AWS.Lambda.Powertools.Logging;
using AWS.Lambda.Powertools.Metrics;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Entities;
using SampleApp.Repositories;

namespace LambdaHandlers
{

    public class PutItemFunction
    {
        readonly ServiceProvider _serviceProvider;

        public PutItemFunction()
        {
            Common.Initialize(out _serviceProvider);
        }

        [Logging(LogEvent = true)]
        [Metrics(Namespace = "SampleApp", Service = "PutItemFunction", CaptureColdStart = true)]
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context) //apigProxyEvent
        {
            Logger.LogInformation($"Request Body: {apigProxyEvent.Body}"); //this log entry may not have additional info

            var item = JsonSerializer.Deserialize<Item>(apigProxyEvent.Body);

            Metrics.PushSingleMetric(
                metricName: "TotalExecutions",
                value: 1,
                unit: MetricUnit.Count,
                nameSpace: "SampleApp",
                service: "PutItemFunction",
                defaultDimensions: new Dictionary<string, string>
                {
                    {"FunctionContext", "$LATEST"}
                });

            

            var additionalInfo = new Dictionary<string, object>()
            {
                {"AdditionalInfo", new Dictionary<string, object>{{ "Id", item.Id }, { "Name", item.Name }}}
            };
            Logger.AppendKeys(additionalInfo);

            Logger.LogDebug("Request Body"); //this log entry will have additional info

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();
                var result = await itemRepository.CreateAsync(item);

                if (result)
                {
                    Metrics.AddMetric("SuccessfulPutItem", 1, MetricUnit.Count);
                    Metrics.AddMetadata("Item.Id", item.Id);

                    return new APIGatewayProxyResponse
                    {
                        Body = JsonSerializer.Serialize<Item>(item),
                        StatusCode = (int)HttpStatusCode.OK,
                        Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                    };

                }
                else
                {
                    Logger.LogError("Fail to persist");
                    Metrics.AddMetric("FailedPutItem", 1, MetricUnit.Count);
                    return new APIGatewayProxyResponse
                    {
                        Body = "Fail to Persist",
                        StatusCode = (int)HttpStatusCode.BadRequest,
                        Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                    };
                }
            }

        }
    }
}
