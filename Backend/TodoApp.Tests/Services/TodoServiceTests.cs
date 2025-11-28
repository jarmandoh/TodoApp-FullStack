using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using TodoApp.API.Data;
using TodoApp.API.DTOs;
using TodoApp.API.Models;
using TodoApp.API.Services;
using Xunit;

namespace TodoApp.Tests.Services;

public class TodoServiceTests
{
    private ApplicationDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new ApplicationDbContext(options);
        
        // Seed test data
        context.Users.Add(new User
        {
            Id = 1,
            Email = "test@example.com",
            Password = "hashedpassword",
            Name = "Test User"
        });

        context.TodoItems.AddRange(
            new TodoItem
            {
                Id = 1,
                Title = "Test Task 1",
                Description = "Description 1",
                IsCompleted = false,
                UserId = 1
            },
            new TodoItem
            {
                Id = 2,
                Title = "Test Task 2",
                Description = "Description 2",
                IsCompleted = true,
                UserId = 1,
                CompletedAt = DateTime.UtcNow
            }
        );
        context.SaveChanges();

        return context;
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllUserTodos()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        // Act
        var result = await todoService.GetAllAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsTodo()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        // Act
        var result = await todoService.GetByIdAsync(1, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Task 1", result.Title);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        // Act
        var result = await todoService.GetByIdAsync(999, 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesNewTodo()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        var newTodo = new CreateTodoItemDto
        {
            Title = "New Task",
            Description = "New Description"
        };

        // Act
        var result = await todoService.CreateAsync(newTodo, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Task", result.Title);
        Assert.False(result.IsCompleted);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesExistingTodo()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        var updateDto = new UpdateTodoItemDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            IsCompleted = true
        };

        // Act
        var result = await todoService.UpdateAsync(1, updateDto, 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated Task", result.Title);
        Assert.True(result.IsCompleted);
        Assert.NotNull(result.CompletedAt);
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        var updateDto = new UpdateTodoItemDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            IsCompleted = true
        };

        // Act
        var result = await todoService.UpdateAsync(999, updateDto, 1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteAsync_DeletesExistingTodo()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        // Act
        var result = await todoService.DeleteAsync(1, 1);

        // Assert
        Assert.True(result);
        
        // Verify deletion
        var todos = await todoService.GetAllAsync(1);
        Assert.Single(todos);
    }

    [Fact]
    public async Task DeleteAsync_WithInvalidId_ReturnsFalse()
    {
        // Arrange
        var context = GetInMemoryContext();
        var logger = new Mock<ILogger<TodoService>>();
        var todoService = new TodoService(context, logger.Object);

        // Act
        var result = await todoService.DeleteAsync(999, 1);

        // Assert
        Assert.False(result);
    }
}
