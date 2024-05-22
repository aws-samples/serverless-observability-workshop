using Amazon.DynamoDBv2.DataModel;

namespace SampleApp.Entities;

// <summary>
/// Map the Item Class to DynamoDb Table
/// To learn more visit https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DeclarativeTagsList.html
/// </summary>
[DynamoDBTable("SampleAppItem")]
public class Item
{
    ///<summary>
    /// Map c# types to DynamoDb Columns 
    /// to learn more visit https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/MidLevelAPILimitations.SupportedTypes.html
    /// <summary>
    [DynamoDBHashKey] //Partition key
    public int Id { get; set; }

    [DynamoDBProperty]
    public string Name { get; set; } = string.Empty;
}
