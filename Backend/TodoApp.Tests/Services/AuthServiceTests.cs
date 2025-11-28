using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using TodoApp.API.Data;
using TodoApp.API.DTOs;
using TodoApp.API.Models;
using TodoApp.API.Services;
using Xunit;

namespace TodoApp.Tests.Services;

public class AuthServiceTests
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
            Password = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            Name = "Test User"
        });
        context.SaveChanges();

        return context;
    }

    private IConfiguration GetConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            {"Jwt:Key", "SuperSecretKeyForTesting123456789!"},
            {"Jwt:Issuer", "TestIssuer"},
            {"Jwt:Audience", "TestAudience"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        return configuration;
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsLoginResponse()
    {
        // Arrange
        var context = GetInMemoryContext();
        var configuration = GetConfiguration();
        var logger = new Mock<ILogger<AuthService>>();
        var authService = new AuthService(context, configuration, logger.Object);

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        // Act
        var result = await authService.LoginAsync(loginRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("test@example.com", result.Email);
        Assert.Equal("Test User", result.Name);
        Assert.NotEmpty(result.Token);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ReturnsNull()
    {
        // Arrange
        var context = GetInMemoryContext();
        var configuration = GetConfiguration();
        var logger = new Mock<ILogger<AuthService>>();
        var authService = new AuthService(context, configuration, logger.Object);

        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        // Act
        var result = await authService.LoginAsync(loginRequest);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ReturnsNull()
    {
        // Arrange
        var context = GetInMemoryContext();
        var configuration = GetConfiguration();
        var logger = new Mock<ILogger<AuthService>>();
        var authService = new AuthService(context, configuration, logger.Object);

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "WrongPassword!"
        };

        // Act
        var result = await authService.LoginAsync(loginRequest);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GenerateJwtToken_ReturnsValidToken()
    {
        // Arrange
        var context = GetInMemoryContext();
        var configuration = GetConfiguration();
        var logger = new Mock<ILogger<AuthService>>();
        var authService = new AuthService(context, configuration, logger.Object);

        // Act
        var token = authService.GenerateJwtToken(1, "test@example.com", "Test User");

        // Assert
        Assert.NotNull(token);
        Assert.NotEmpty(token);
    }
}
