using SampleApp.Entities;

namespace SampleApp.Repositories
{
    /// <summary>
    /// Sample DynamoDB Table item CRUD
    /// </summary>
    public interface IItemRepository
    {
        /// <summary>
        /// Include new item to the DynamoDB Table
        /// </summary>
        /// <param name="item">item to include</param>
        /// <returns>success/failure</returns>
        Task<bool> CreateAsync(Item item);
        
        /// <summary>
        /// Remove existing item from DynamoDB Table
        /// </summary>
        /// <param name="item">item to remove</param>
        /// <returns></returns>
        Task<bool> DeleteAsync(Item item);

        /// <summary>
        /// List item from DynamoDb Table with items limit (default=10)
        /// </summary>
        /// <param name="limit">limit (default=10)</param>
        /// <returns>Collection of items</returns>
        Task<IList<Item>> GetItemsAsync(int limit = 10);

        /// <summary>
        /// Get item by PK
        /// </summary>
        /// <param name="id">item`s PK</param>
        /// <returns>Item object</returns>
        Task<Item?> GetByIdAsync(int id);
        
        /// <summary>
        /// Update item content
        /// </summary>
        /// <param name="item">item to be updated</param>
        /// <returns></returns>
        Task<bool> UpdateAsync(Item item);
    }
}