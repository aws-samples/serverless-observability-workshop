using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
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

        // POST api/items
        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apigProxyEvent, ILambdaContext context)
        {
            Console.WriteLine("Getting ip address from external service");
            var location = await Common.GetCallingIP();

            Console.WriteLine("ip address successfuly captured");

            var item = JsonSerializer.Deserialize<Item>(apigProxyEvent.Body);

            using (var scope = _serviceProvider.CreateScope())
            {
                var itemRepository = scope.ServiceProvider.GetRequiredService<IItemRepository>();
                var result = await itemRepository.CreateAsync(item);

                if (result)
                {
                    return Common.APIResponse(HttpStatusCode.OK, JsonSerializer.Serialize<Item>(item));
                }
                else
                {
                    return Common.APIResponse(HttpStatusCode.BadRequest, "Fail to Persist");
                }
            }

        }
    }
}
