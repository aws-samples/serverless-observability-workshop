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
            Common.Initialize(out _serviceProvider);
        }

        [Logging(LogEvent = true)]
        [Tracing]
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            Foo();

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();

                var body = await itemRepository.GetItemsAsync();
                var result = JsonSerializer.Serialize(body);

                Logger.LogInformation($"Retrieved {body.Count} items from DynamoDB");
                Tracing.AddAnnotation("ItemsReturned", body.Count);
                Tracing.AddMetadata("Headers", apigProxyEvent.Headers);

                return new APIGatewayProxyResponse
                {
                    Body = result,
                    StatusCode = (int)HttpStatusCode.OK,
                    Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                };

            }
        }

        [Tracing(SegmentName = "Foo")]
        private void Foo()
        {
            Tracing.AddAnnotation("Item", "Bar");
        }
    }
}
