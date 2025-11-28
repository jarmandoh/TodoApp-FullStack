using Microsoft.EntityFrameworkCore;
using TodoApp.API.Data;
using TodoApp.API.DTOs;
using TodoApp.API.Models;

namespace TodoApp.API.Services;

public class TodoService : ITodoService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TodoService> _logger;

    public TodoService(ApplicationDbContext context, ILogger<TodoService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<TodoItemDto>> GetAllAsync(int userId)
    {
        try
        {
            var todos = await _context.TodoItems
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TodoItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt
                })
                .ToListAsync();

            return todos;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener las tareas del usuario {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoItemDto?> GetByIdAsync(int id, int userId)
    {
        try
        {
            var todo = await _context.TodoItems
                .Where(t => t.Id == id && t.UserId == userId)
                .Select(t => new TodoItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt
                })
                .FirstOrDefaultAsync();

            return todo;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener la tarea {TodoId} del usuario {UserId}", id, userId);
            throw;
        }
    }

    public async Task<TodoItemDto> CreateAsync(CreateTodoItemDto dto, int userId)
    {
        try
        {
            var todo = new TodoItem
            {
                Title = dto.Title,
                Description = dto.Description,
                IsCompleted = false,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Tarea creada: {TodoId} para el usuario {UserId}", todo.Id, userId);

            return new TodoItemDto
            {
                Id = todo.Id,
                Title = todo.Title,
                Description = todo.Description,
                IsCompleted = todo.IsCompleted,
                CreatedAt = todo.CreatedAt,
                CompletedAt = todo.CompletedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear tarea para el usuario {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoItemDto dto, int userId)
    {
        try
        {
            var todo = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null)
            {
                return null;
            }

            todo.Title = dto.Title;
            todo.Description = dto.Description;
            
            if (dto.IsCompleted && !todo.IsCompleted)
            {
                todo.CompletedAt = DateTime.UtcNow;
            }
            else if (!dto.IsCompleted && todo.IsCompleted)
            {
                todo.CompletedAt = null;
            }
            
            todo.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Tarea actualizada: {TodoId} para el usuario {UserId}", id, userId);

            return new TodoItemDto
            {
                Id = todo.Id,
                Title = todo.Title,
                Description = todo.Description,
                IsCompleted = todo.IsCompleted,
                CreatedAt = todo.CreatedAt,
                CompletedAt = todo.CompletedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar la tarea {TodoId} del usuario {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        try
        {
            var todo = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null)
            {
                return false;
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Tarea eliminada: {TodoId} para el usuario {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar la tarea {TodoId} del usuario {UserId}", id, userId);
            throw;
        }
    }
}
