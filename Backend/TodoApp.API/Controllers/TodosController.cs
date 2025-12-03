using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.API.DTOs;
using TodoApp.API.Services;

namespace TodoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodosController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("sub")?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    /// <summary>
    /// Obtiene todas las tareas del usuario autenticado
    /// </summary>
    /// <returns>Lista de tareas</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TodoItemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TodoItemDto>>>> GetAll()
    {
        var userId = GetUserId();
        var todos = await _todoService.GetAllAsync(userId);
        return Ok(ApiResponse<List<TodoItemDto>>.SuccessResponse(todos, "Tareas obtenidas exitosamente"));
    }

    /// <summary>
    /// Obtiene una tarea específica por ID
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Tarea solicitada</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TodoItemDto>>> GetById(int id)
    {
        var userId = GetUserId();
        var todo = await _todoService.GetByIdAsync(id, userId);

        if (todo == null)
        {
            return NotFound(ApiResponse<TodoItemDto>.ErrorResponse("Tarea no encontrada"));
        }

        return Ok(ApiResponse<TodoItemDto>.SuccessResponse(todo, "Tarea obtenida exitosamente"));
    }

    /// <summary>
    /// Crea una nueva tarea
    /// </summary>
    /// <param name="dto">Datos de la nueva tarea</param>
    /// <returns>Tarea creada</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TodoItemDto>>> Create([FromBody] CreateTodoItemDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(ApiResponse<TodoItemDto>.ErrorResponse("Datos de entrada inválidos", errors));
        }

        var userId = GetUserId();
        var todo = await _todoService.CreateAsync(dto, userId);

        return CreatedAtAction(
            nameof(GetById),
            new { id = todo.Id },
            ApiResponse<TodoItemDto>.SuccessResponse(todo, "Tarea creada exitosamente"));
    }

    /// <summary>
    /// Actualiza una tarea existente
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <param name="dto">Datos actualizados de la tarea</param>
    /// <returns>Tarea actualizada</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<TodoItemDto>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TodoItemDto>>> Update(int id, [FromBody] UpdateTodoItemDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(ApiResponse<TodoItemDto>.ErrorResponse("Datos de entrada inválidos", errors));
        }

        var userId = GetUserId();
        var todo = await _todoService.UpdateAsync(id, dto, userId);

        if (todo == null)
        {
            return NotFound(ApiResponse<TodoItemDto>.ErrorResponse("Tarea no encontrada"));
        }

        return Ok(ApiResponse<TodoItemDto>.SuccessResponse(todo, "Tarea actualizada exitosamente"));
    }

    /// <summary>
    /// Elimina una tarea
    /// </summary>
    /// <param name="id">ID de la tarea</param>
    /// <returns>Confirmación de eliminación</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var userId = GetUserId();
        var result = await _todoService.DeleteAsync(id, userId);

        if (!result)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Tarea no encontrada"));
        }

        return Ok(ApiResponse<object?>.SuccessResponse(null, "Tarea eliminada exitosamente"));
    }

    /// <summary>
    /// Obtiene estadísticas de las tareas del usuario
    /// </summary>
    /// <returns>Estadísticas de tareas</returns>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<object>>> GetStats()
    {
        var userId = GetUserId();
        var todos = await _todoService.GetAllAsync(userId);

        var stats = new
        {
            Total = todos.Count,
            Completed = todos.Count(t => t.IsCompleted),
            Pending = todos.Count(t => !t.IsCompleted),
            HighPriority = todos.Count(t => t.Priority == TodoApp.API.Models.TodoPriority.High),
            MediumPriority = todos.Count(t => t.Priority == TodoApp.API.Models.TodoPriority.Medium),
            LowPriority = todos.Count(t => t.Priority == TodoApp.API.Models.TodoPriority.Low)
        };

        return Ok(ApiResponse<object>.SuccessResponse(stats, "Estadísticas obtenidas exitosamente"));
    }
}
