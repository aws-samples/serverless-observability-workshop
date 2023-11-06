using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using SampleApp.Entities;

namespace SampleApp.Repositories
{


    public class ItemRepository : IItemRepository
    {
        private readonly IDynamoDBContext context;
        private readonly ILogger<ItemRepository> logger;

        public ItemRepository(IDynamoDBContext context, ILogger<ItemRepository> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        public async Task<bool> CreateAsync(Item item)
        {
            try
            {
                if (item.Id < 0) {
                    logger.LogError("Id cannot be lower than 0");
                    return false;
                }
                await context.SaveAsync(item);
                logger.LogInformation("Item {} is added", item.Id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "fail to persist to DynamoDb Table");
                return false;
            }

            return true;
        }

        public async Task<bool> DeleteAsync(Item item)
        {
            bool result;
            try
            {
                // Delete the item.
                await context.DeleteAsync<Item>(item.Id);
                // Try to retrieve deleted item. It should return null.
                Item deletedItem = await context.LoadAsync<Item>(item.Id, new DynamoDBContextConfig
                {
                    ConsistentRead = true
                });

                result = deletedItem == null;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "fail to delete item from DynamoDb Table");
                result = false;
            }

            if (result) logger.LogInformation("Item {Id} is deleted", item);

            return result;
        }

        public async Task<bool> UpdateAsync(Item item)
        {
            if (item == null) return false;

            try
            {
                await context.SaveAsync(item);
                logger.LogInformation("Item {Id} is updated", item);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "fail to update item from DynamoDb Table");
                return false;
            }

            return true;
        }

        public async Task<Item?> GetByIdAsync(int id)
        {
            try
            {
                return await context.LoadAsync<Item>(id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "fail to update item from DynamoDb Table");
                return null;
            }
        }

        public async Task<IList<Item>> GetItemsAsync(int limit = 10)
        {
            var result = new List<Item>();

            try
            {
                if (limit <= 0)
                {
                    return result;
                }

                var filter = new ScanFilter();
                filter.AddCondition("Id", ScanOperator.IsNotNull);
                var scanConfig = new ScanOperationConfig()
                {
                    Limit = limit,
                    Filter = filter
                };
                var queryResult = context.FromScanAsync<Item>(scanConfig);

                do
                {
                    result.AddRange(await queryResult.GetNextSetAsync());
                }
                while (!queryResult.IsDone && result.Count < limit);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "fail to list items from DynamoDb Table");
                return new List<Item>();
            }

            return result;
        }
    }
}
