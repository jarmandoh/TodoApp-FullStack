using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.API.DTOs;
using TodoApp.API.Services;

namespace TodoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationDto>>>> GetNotifications()
    {
        var userId = GetUserId();
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(new ApiResponse<IEnumerable<NotificationDto>>
        {
            Success = true,
            Data = notifications,
            Message = "Notificaciones obtenidas exitosamente"
        });
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
    {
        var userId = GetUserId();
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(new ApiResponse<int>
        {
            Success = true,
            Data = count,
            Message = "Contador obtenido exitosamente"
        });
    }

    [HttpPost("{id}/mark-read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(int id)
    {
        var userId = GetUserId();
        var success = await _notificationService.MarkAsReadAsync(id, userId);
        
        if (!success)
        {
            return NotFound(new ApiResponse<bool>
            {
                Success = false,
                Message = "Notificación no encontrada"
            });
        }

        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Notificación marcada como leída"
        });
    }

    [HttpPost("mark-all-read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead()
    {
        var userId = GetUserId();
        await _notificationService.MarkAllAsReadAsync(userId);
        
        return Ok(new ApiResponse<bool>
        {
            Success = true,
            Data = true,
            Message = "Todas las notificaciones marcadas como leídas"
        });
    }
}
