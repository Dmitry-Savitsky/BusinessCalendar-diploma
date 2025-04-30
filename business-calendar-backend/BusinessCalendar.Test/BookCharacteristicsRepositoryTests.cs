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
    public class BookCharacteristicsRepositoryTests
    {
        private DbContextOptions<BusinessCalendarDbContext> CreateDbContextOptions() =>
            new DbContextOptionsBuilder<BusinessCalendarDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

        [Fact]
        public async Task GetBooksByAuthorIdAsync_ShouldReturnCorrectBooks()
        {
            // Arrange
            var options = CreateDbContextOptions();

            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.Add(new Author
                {
                    Id = 1,
                    Name = "John",
                    Surename = "Doe",
                    Country = "USA"
                });

                context.BookCharacteristics.AddRange(
                    new BookCharacteristics
                    {
                        Id = 1,
                        ISBN = 123456,
                        Title = "Book One",
                        Genre = "Fiction",
                        AuthorId = 1
                    },
                    new BookCharacteristics
                    {
                        Id = 2,
                        ISBN = 789012,
                        Title = "Book Two",
                        Genre = "Science",
                        AuthorId = 1
                    },
                    new BookCharacteristics
                    {
                        Id = 3,
                        ISBN = 345678,
                        Title = "Book Three",
                        Genre = "Fantasy",
                        AuthorId = 2 
                    }
                );
                await context.SaveChangesAsync();
            }

            // Act
            IEnumerable<BookCharacteristics> result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new BookCharacteristicsRepository(context);
                result = await repository.GetBooksByAuthorIdAsync(1);
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, b => b.Title == "Book One" && b.ISBN == 123456);
            Assert.Contains(result, b => b.Title == "Book Two" && b.ISBN == 789012);
        }
    }
}
