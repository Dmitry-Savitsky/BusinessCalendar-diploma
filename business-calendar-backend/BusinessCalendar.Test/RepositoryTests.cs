using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BusinessCalendar.Tests.Repositories
{
    public class RepositoryTests
    {
        private DbContextOptions<BusinessCalendarDbContext> CreateDbContextOptions() =>
            new DbContextOptionsBuilder<BusinessCalendarDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

        [Fact]
        public async Task AddAsync_ShouldAddEntity()
        {
            // Arrange
            var options = CreateDbContextOptions();
            var author = new Author { Id = 1, Name = "Test", Surename = "Author", Country = "TestCountry" };

            // Act
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new Repository<Author>(context);
                await repository.AddAsync(author);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new BusinessCalendarDbContext(options))
            {
                Assert.Equal(1, await context.Authors.CountAsync());
                Assert.NotNull(await context.Authors.FindAsync(1));
            }
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnCorrectEntity()
        {
            // Arrange
            var options = CreateDbContextOptions();
            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.Add(new Author { Id = 1, Name = "John", Surename = "Doe", Country = "USA" });
                await context.SaveChangesAsync();
            }

            // Act
            Author result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new Repository<Author>(context);
                result = await repository.GetByIdAsync(1);
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John", result.Name);
            Assert.Equal("Doe", result.Surename);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllEntities()
        {
            // Arrange
            var options = CreateDbContextOptions();
            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.AddRange(
                    new Author { Id = 1, Name = "John", Surename = "Doe", Country = "USA" },
                    new Author { Id = 2, Name = "Jane", Surename = "Smith", Country = "Canada" }
                );
                await context.SaveChangesAsync();
            }

            // Act
            IEnumerable<Author> result;
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new Repository<Author>(context);
                result = await repository.GetAllAsync();
            }

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task Update_ShouldModifyEntity()
        {
            // Arrange
            var options = CreateDbContextOptions();
            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.Add(new Author { Id = 1, Name = "OldName", Surename = "OldSurname", Country = "USA" });
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new Repository<Author>(context);
                var author = await repository.GetByIdAsync(1);
                author.Name = "NewName";
                repository.Update(author);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new BusinessCalendarDbContext(options))
            {
                var updatedAuthor = await context.Authors.FindAsync(1);
                Assert.Equal("NewName", updatedAuthor.Name);
            }
        }

        [Fact]
        public async Task Delete_ShouldRemoveEntity()
        {
            // Arrange
            var options = CreateDbContextOptions();
            using (var context = new BusinessCalendarDbContext(options))
            {
                context.Authors.Add(new Author { Id = 1, Name = "John", Surename = "Doe", Country = "USA" });
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new BusinessCalendarDbContext(options))
            {
                var repository = new Repository<Author>(context);
                var author = await repository.GetByIdAsync(1);
                repository.Delete(author);
                await context.SaveChangesAsync();
            }

            // Assert
            using (var context = new BusinessCalendarDbContext(options))
            {
                Assert.Null(await context.Authors.FindAsync(1));
                Assert.Equal(0, await context.Authors.CountAsync());
            }
        }
    }
}
