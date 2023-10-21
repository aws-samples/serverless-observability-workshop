using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
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

        // GET api/items
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            var location = await Common.GetCallingIP();
            Console.WriteLine("Getting ip address from external service");
            Console.WriteLine($"Location: {location}");

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();

                var body = await itemRepository.GetItemsAsync();
                var result = JsonSerializer.Serialize(body);

                return Common.APIResponse(HttpStatusCode.OK, result);
            }
        }      

    }
}
