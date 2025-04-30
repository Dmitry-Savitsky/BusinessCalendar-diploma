using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BusinessCalendar.Tests.Repositories
{
    public class AuthorRepositoryTests
    {
        [Fact]
        public async Task GetAuthorsByCountryAsync_ShouldReturnCorrectAuthors()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<BusinessCalendarDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) 
                .Options;

            
            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.AddRange(
                    new Author
                    {
                        Id = 1,
                        Name = "John",
                        Surename = "Doe",
                        Country = "USA"
                    },
                    new Author
                    {
                        Id = 2,
                        Name = "Jane",
                        Surename = "Smith",
                        Country = "USA"
                    },
                    new Author
                    {
                        Id = 3,
                        Name = "Pierre",
                        Surename = "Dupont",
                        Country = "France"
                    }
                );
                await context.SaveChangesAsync();
            }

            IEnumerable<Author> result;

            // Act
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new AuthorRepository(context);
                result = await repository.GetAuthorsByCountryAsync("USA");
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, a => a.Name == "John" && a.Surename == "Doe");
            Assert.Contains(result, a => a.Name == "Jane" && a.Surename == "Smith");
        }
    }
}
