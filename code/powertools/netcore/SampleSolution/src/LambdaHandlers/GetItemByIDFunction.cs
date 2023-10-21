using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using AWS.Lambda.Powertools.Logging;
using Microsoft.Extensions.DependencyInjection;
using SampleApp.Repositories;

namespace LambdaHandlers
{

    public class GetItemByIDFunction
    {
        readonly ServiceProvider _serviceProvider;

        public GetItemByIDFunction()
        {
            Common.Initialize(out _serviceProvider);
        }

        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();

                var id = apigProxyEvent.PathParameters["id"];

                Logger.LogInformation($"ID {id}");

                var result = await itemRepository.GetByIdAsync(int.Parse(id));

                if (result == null)
                {
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = (int)HttpStatusCode.NotFound,
                        Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                    };
                }

                return new APIGatewayProxyResponse
                {
                    Body = JsonSerializer.Serialize(result),
                    StatusCode = (int)HttpStatusCode.OK,
                    Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
                };
            }
        }
    }
}