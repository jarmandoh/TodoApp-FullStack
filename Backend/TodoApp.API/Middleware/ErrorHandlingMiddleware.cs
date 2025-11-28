using System.Net;
using TodoApp.API.DTOs;

namespace TodoApp.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado en la aplicación");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var message = "Ha ocurrido un error interno en el servidor";

        if (exception is UnauthorizedAccessException)
        {
            code = HttpStatusCode.Unauthorized;
            message = "No autorizado";
        }
        else if (exception is ArgumentException)
        {
            code = HttpStatusCode.BadRequest;
            message = exception.Message;
        }

        var response = ApiResponse<object>.ErrorResponse(message, new List<string> { exception.Message });

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsJsonAsync(response);
    }
}
