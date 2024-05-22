using System.Net;
using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using SampleApp.Entities;
using SampleApp.Repositories;
using AWS.Lambda.Powertools.Logging;
using AWS.Lambda.Powertools.Metrics;

namespace SampleApp.LambdaHandlers
{

    public class PutItemFunction
    {
        readonly ServiceProvider _serviceProvider;

        public PutItemFunction()
        {
            Common.Initialize(out _serviceProvider);
        }

        // POST api/items
        [Logging(LogEvent = true)]
        [Metrics(Namespace = "SampleApp", Service = "Items", CaptureColdStart = true)]
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            Metrics.PushSingleMetric(
                    metricName: "TotalExecutions",
                    value: 1,
                    unit: MetricUnit.Count,
                    nameSpace: "SampleApp",
                    service: "Items",
                    defaultDimensions: new Dictionary<string, string>
                    {
                        {"FunctionContext", "$LATEST"}
                    });

            Logger.LogInformation("Getting ip address from external service"); //this log entry may not have additional info
            var location = await Common.GetCallingIP();

            var additionalInfo = new Dictionary<string, object>()
            {
                {"AdditionalInfo", new Dictionary<string, object>{{ "RequestLocation", location }, { "Body", apigProxyEvent.Body } }}
            };
            Logger.AppendKeys(additionalInfo);

            Logger.LogDebug("ip address successfuly captured"); //this log entry will have additional info

            var item = JsonSerializer.Deserialize<Item>(apigProxyEvent.Body);

            if (item == null) return Common.APIResponse(HttpStatusCode.BadRequest, "Fail to validate body");

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();
                var result = await itemRepository.CreateAsync(item);

                if (result)
                {
                    Metrics.AddMetric("SuccessfulPutItem", 1, MetricUnit.Count);
                    Metrics.AddMetadata("request_location", location);
                    return Common.APIResponse(HttpStatusCode.OK, JsonSerializer.Serialize<Item>(item));
                }
                else
                {
                    Metrics.AddMetric("FailedPutItem", 1, MetricUnit.Count);
                    return Common.APIResponse(HttpStatusCode.BadRequest, "Fail to Persist");
                }
            }

        }
    }
}
