using System.ComponentModel.DataAnnotations;
using TodoApp.API.Models;

namespace TodoApp.API.DTOs;

public class TodoItemDto
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "El título es requerido")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    public bool IsCompleted { get; set; }
    public TodoPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int UserId { get; set; }
}

public class CreateTodoItemDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    public TodoPriority Priority { get; set; } = TodoPriority.Medium;
    
    public DateTime? DueDate { get; set; }
}

public class UpdateTodoItemDto
{
    public string? Title { get; set; }
    
    public string? Description { get; set; }
    
    public bool? IsCompleted { get; set; }
    
    public TodoPriority? Priority { get; set; }
    
    public DateTime? DueDate { get; set; }
}
