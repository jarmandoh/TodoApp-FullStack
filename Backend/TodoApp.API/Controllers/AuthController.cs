using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.API.DTOs;
using TodoApp.API.Services;

namespace TodoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Autentica un usuario y devuelve un token JWT
    /// </summary>
    /// <param name="request">Credenciales de login</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(ApiResponse<LoginResponse>.ErrorResponse("Datos de entrada inválidos", errors));
        }

        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(ApiResponse<LoginResponse>.ErrorResponse("Email o contraseña incorrectos"));
        }

        return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "Login exitoso"));
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    /// <summary>
    /// Actualiza información del usuario autenticado
    /// </summary>
    [HttpPut("update-profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateProfile([FromBody] UpdateUserDto dto)
    {
        var userId = GetUserId();
        var result = await _authService.UpdateUserAsync(userId, dto);

        if (result == null)
        {
            return BadRequest(ApiResponse<UserDto>.ErrorResponse("No se pudo actualizar el perfil. El email podría estar en uso."));
        }

        return Ok(ApiResponse<UserDto>.SuccessResponse(result, "Perfil actualizado exitosamente"));
    }

    /// <summary>
    /// Cambia la contraseña del usuario autenticado
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse("Las contraseñas no pueden estar vacías"));
        }

        if (dto.NewPassword.Length < 6)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse("La nueva contraseña debe tener al menos 6 caracteres"));
        }

        var userId = GetUserId();
        var success = await _authService.ChangePasswordAsync(userId, dto);

        if (!success)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse("Contraseña actual incorrecta"));
        }

        return Ok(ApiResponse<bool>.SuccessResponse(true, "Contraseña cambiada exitosamente"));
    }
}
