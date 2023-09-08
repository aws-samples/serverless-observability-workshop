using Bogus;
using SampleApp.Entities;
using SampleApp.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SampleApp.Tests
{
    internal class MockItemRepository : IItemRepository
    {
        private readonly Faker<Item> fakeEntity;

        public MockItemRepository()
        {
            fakeEntity = new Faker<Item>()
            .RuleFor(o => o.Name, f => f.Person.FullName)
            .RuleFor(o => o.Id, f => f.IndexFaker);
        }

        public Task<bool> CreateAsync(Item book)
        {
            return Task.FromResult(true);
        }

        public Task<bool> DeleteAsync(Item book)
        {
            return Task.FromResult(true);
        }

        public Task<IList<Item>> GetItemsAsync(int limit = 10)
        {
            IList<Item> items = fakeEntity.Generate(limit).ToList();

            return Task.FromResult(items);
        }

        public Task<Item?> GetByIdAsync(int id)
        {
            _ = fakeEntity.RuleFor(o => o.Id, f => id);
            var item = fakeEntity.Generate() ?? null;

            return Task.FromResult(item);
        }

        public Task<bool> UpdateAsync(Item book)
        {
            return Task.FromResult(true);
        }
    }
}
