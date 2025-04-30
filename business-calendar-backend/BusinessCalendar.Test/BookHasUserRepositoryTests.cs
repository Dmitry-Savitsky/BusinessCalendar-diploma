using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BusinessCalendar.Tests.Repositories
{
    public class BookHasUserRepositoryTests
    {
        private DbContextOptions<BusinessCalendarDbContext> CreateDbContextOptions() =>
            new DbContextOptionsBuilder<BusinessCalendarDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

        [Fact]
        public async Task GetUserBooksAsync_ShouldReturnCorrectData()
        {
            // Arrange
            var options = CreateDbContextOptions();

            using (var context = new BusinessCalendarDbContext(options))
            {
                context.BookHasUsers.AddRange(
                    new BookHasUser
                    {
                        BookId = 101,
                        UserId = 1,
                        TimeBorrowed = DateTime.Now.AddDays(-10),
                        Book = new Book
                        {
                            Id = 101,
                            BookCharacteristics = new BookCharacteristics { Title = "Fiction" }
                        }
                    },
                    new BookHasUser
                    {
                        BookId = 102,
                        UserId = 1,
                        TimeBorrowed = DateTime.Now.AddDays(-5),
                        Book = new Book
                        {
                            Id = 102,
                            BookCharacteristics = new BookCharacteristics { Title = "Science" }
                        }
                    }
                );
                await context.SaveChangesAsync();
            }

            // Act
            IEnumerable<object> result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new BookHasUserRepository(context);
                result = await repository.GetUserBooksAsync(1);
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAvailableBooksByCharacteristicsIdAsync_ShouldReturnAvailableBooks()
        {
            // Arrange
            var options = CreateDbContextOptions();

            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Books.AddRange(
                    new Book
                    {
                        Id = 1,
                        BookCharacteristicsId = 100
                    },
                    new Book
                    {
                        Id = 2,
                        BookCharacteristicsId = 100
                    },
                    new Book
                    {
                        Id = 3,
                        BookCharacteristicsId = 200
                    }
                );

                context.BookHasUsers.Add(new BookHasUser
                {
                    BookId = 1, 
                    UserId = 1,
                    TimeBorrowed = DateTime.Now
                });

                await context.SaveChangesAsync();
            }

            // Act
            IEnumerable<Book> result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new BookHasUserRepository(context);
                result = await repository.GetAvailableBooksByCharacteristicsIdAsync(100);
            }

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Contains(result, b => b.Id == 2);
        }

        [Fact]
        public async Task GetByConditionAsync_ShouldReturnCorrectData()
        {
            // Arrange
            var options = CreateDbContextOptions();

            using (var context = new BusinessCalendarDbContext(options))
            {
                context.BookHasUsers.AddRange(
                    new BookHasUser
                    {
                        BookId = 101,
                        UserId = 1,
                        TimeBorrowed = DateTime.Now.AddDays(-10)
                    },
                    new BookHasUser
                    {
                        BookId = 102,
                        UserId = 2,
                        TimeBorrowed = DateTime.Now.AddDays(-5)
                    },
                    new BookHasUser
                    {
                        BookId = 103,
                        UserId = 1,
                        TimeBorrowed = DateTime.Now.AddDays(-2)
                    }
                );
                await context.SaveChangesAsync();
            }

            // Act
            IEnumerable<BookHasUser> result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new BookHasUserRepository(context);
                result = await repository.GetByConditionAsync(bhu => bhu.UserId == 1);
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, bhu => bhu.BookId == 101);
            Assert.Contains(result, bhu => bhu.BookId == 103);
        }
    }
}
