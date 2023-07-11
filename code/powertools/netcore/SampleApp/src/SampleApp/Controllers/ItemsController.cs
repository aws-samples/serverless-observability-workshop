using Amazon.DynamoDBv2.DataModel;
using AWS.Lambda.Powertools.Logging;
using AWS.Lambda.Powertools.Metrics;
using Microsoft.AspNetCore.Mvc;
using SampleApp.Entities;
using SampleApp.Repositories;

namespace SampleApp.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
public class ItemsController : ControllerBase
{
    private readonly ILogger<ItemsController> logger;
    private readonly IItemRepository itemRepository;
    private static readonly HttpClient client = new HttpClient();

    public ItemsController(ILogger<ItemsController> logger, IItemRepository itemRepository)
    {
        this.logger = logger;
        this.itemRepository = itemRepository;
    }

    // GET api/items
    [HttpGet]
    [Logging(LogEvent = true)]
    public async Task<ActionResult<IEnumerable<Item>>> Get([FromQuery] int limit = 10)
    {
        var location = await GetCallingIP();
        Logger.LogInformation("Getting ip address from external service");
        Logger.LogInformation($"Location: {location}");
        
        if (limit <= 0 || limit > 100) return BadRequest("The limit should been between [1-100]");

        return Ok(await itemRepository.GetItemsAsync(limit));
    }

    // GET api/items/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Item>> GetById(int id)
    {
        var result = await itemRepository.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    // POST api/items
    [HttpPost]
    [Logging(LogEvent = true)]
    [Metrics(Namespace = "SampleApp", Service = "Items", CaptureColdStart = true)]
    public async Task<ActionResult<Item>> Post([FromBody] Item item)
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
        var location = await GetCallingIP();

        var additionalInfo = new Dictionary<string, object>()
        {
            {"AdditionalInfo", new Dictionary<string, object>{{ "RequestLocation", location }, { "ItemID", item.Id }}}
        };
        Logger.AppendKeys(additionalInfo);

        Logger.LogDebug("ip address successfuly captured"); //this log entry will have additional info

        if (item == null) {
            return ValidationProblem("Invalid input! Item not informed");
        }

        var result = await itemRepository.CreateAsync(item);

        if (result)
        {
            Metrics.AddMetric("SuccessfulPutItem", 1, MetricUnit.Count);
            Metrics.AddMetadata("request_location", location);
            return CreatedAtAction(
                nameof(Get),
                new { id = item.Id },
                item);
        }
        else
        {
            Logger.LogError("Fail to persist");
            Metrics.AddMetric("FailedPutItem", 1, MetricUnit.Count);
            return BadRequest("Fail to persist");
        }

    }

    // PUT api/items/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Item item)
    {
        if (id == int.MinValue || item == null) return ValidationProblem("Invalid request payload");

        // Retrieve the item.
        var itemRetrieved = await itemRepository.GetByIdAsync(id);

        if (itemRetrieved == null)
        {
            var errorMsg = $"Invalid input! No item found with id:{id}";
            return NotFound(errorMsg);
        }

        item.Id = itemRetrieved.Id;

        await itemRepository.UpdateAsync(item);
        return Ok();
    }

    // DELETE api/items/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id == int.MinValue) return ValidationProblem("Invalid request payload");

        var itemRetrieved = await itemRepository.GetByIdAsync(id);

        if (itemRetrieved == null)
        {
            var errorMsg = $"Invalid input! No item found with id:{id}";
            return NotFound(errorMsg);
        }

        await itemRepository.DeleteAsync(itemRetrieved);
        return Ok();
    }

    private static async Task<string> GetCallingIP()
        {
            try
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Add("User-Agent", "AWS Lambda .Net Client");

                var msg = await client.GetStringAsync("http://checkip.amazonaws.com/").ConfigureAwait(continueOnCapturedContext:false);

                return msg.Replace("\n","");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                throw;
            }
        }
}
