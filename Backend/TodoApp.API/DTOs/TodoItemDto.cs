using System.ComponentModel.DataAnnotations;

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
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CreateTodoItemDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;
}

public class UpdateTodoItemDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [MaxLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string Description { get; set; } = string.Empty;
    
    public bool IsCompleted { get; set; }
}
