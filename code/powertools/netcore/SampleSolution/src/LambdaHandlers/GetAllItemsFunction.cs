using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using AWS.Lambda.Powertools.Logging;
using AWS.Lambda.Powertools.Tracing;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Repositories;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
namespace LambdaHandlers
{

    public class GetAllItemsFunction
    {
        readonly ServiceProvider _serviceProvider;

        public GetAllItemsFunction()
        {
            Core.Initialize(out _serviceProvider);
        }

        [Logging(LogEvent = true)]
        [Tracing]
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();

                Logger.LogInformation("Getting ip address from external service");
                //Logger.LogInformation($"Location: {location}");
                //Tracing.AddAnnotation("Location", location);
                //Tracing.AddMetadata("Location", location);

                //if (limit <= 0 || limit > 100) return BadRequest("The limit should been between [1-100]");

                var body = await itemRepository.GetItemsAsync();

                return new APIGatewayProxyResponse
                {
                    Body = JsonSerializer.Serialize(body),
                    StatusCode = (int)HttpStatusCode.OK,
                    Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                };

            }
        }
    }
}
