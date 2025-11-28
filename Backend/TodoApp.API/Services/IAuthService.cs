using TodoApp.API.DTOs;

namespace TodoApp.API.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    string GenerateJwtToken(int userId, string email, string name);
}
