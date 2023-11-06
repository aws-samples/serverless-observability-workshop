using System.Net;
using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using SampleApp.Repositories;

namespace SampleApp.LambdaHandlers
{
    public class GetItemByIDFunction
    {
        readonly ServiceProvider _serviceProvider;

        public GetItemByIDFunction()
        {
            Common.Initialize(out _serviceProvider);
        }
        // GET api/items/{id}
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();

                var id = apigProxyEvent.PathParameters["id"];

                var result = await itemRepository.GetByIdAsync(int.Parse(id));

                return (result == null) ? Common.APIResponse(HttpStatusCode.NotFound, string.Empty) : Common.APIResponse(HttpStatusCode.OK, JsonSerializer.Serialize(result));
            }
        }
    }
}