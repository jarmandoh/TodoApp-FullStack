# 🏗️ Decisiones Técnicas - TodoApp

## Documento de Arquitectura y Decisiones de Diseño

### Índice
1. [Decisiones Backend](#decisiones-backend)
2. [Decisiones Frontend](#decisiones-frontend)
3. [Seguridad](#seguridad)
4. [Rendimiento](#rendimiento)
5. [Escalabilidad](#escalabilidad)
6. [Mantenibilidad](#mantenibilidad)

---

## Decisiones Backend

### 1. .NET 10 Web API

**Decisión**: Utilizar .NET 10 (preview) en lugar de .NET 8 LTS.

**Razones**:
- Cumple con los requisitos de la prueba técnica (.NET 9+)
- Acceso a las últimas características del framework
- Mejoras de rendimiento en comparación con versiones anteriores
- Preparación para el futuro (release oficial próximo)

**Trade-offs**:
- ❌ Versión preview menos estable que LTS
- ✅ Características más modernas
- ✅ Mejor rendimiento

---

### 2. Entity Framework Core con InMemory Database

**Decisión**: Usar base de datos en memoria en lugar de SQL Server.

**Razones**:
- **Simplicidad**: No requiere configuración de servidor de base de datos
- **Portabilidad**: El proyecto se ejecuta inmediatamente sin dependencias externas
- **Pruebas**: Ideal para desarrollo y demostraciones
- **Rapidez**: Inicialización instantánea

**Trade-offs**:
- ❌ Los datos se pierden al reiniciar la aplicación
- ❌ No apto para producción
- ✅ Perfecto para pruebas técnicas y desarrollo
- ✅ Fácil migración a base de datos real

**Migración a Producción**:
```csharp
// Cambiar de:
options.UseInMemoryDatabase("TodoAppDb")

// A:
options.UseSqlServer(connectionString)
// O:
options.UseNpgsql(connectionString) // PostgreSQL
```

---

### 3. Autenticación JWT

**Decisión**: Implementar autenticación basada en JWT en lugar de cookies o Identity Server.

**Razones**:
- **Stateless**: No requiere almacenamiento de sesiones en el servidor
- **Escalabilidad**: Facilita la escalabilidad horizontal
- **Compatibilidad**: Funciona perfectamente con aplicaciones SPA
- **Simplicidad**: Más simple que Identity Server para este caso de uso
- **Estándar**: Ampliamente adoptado en la industria

**Implementación**:
```csharp
var token = new JwtSecurityToken(
    issuer: "TodoAppAPI",
    audience: "TodoAppClient",
    claims: claims,
    expires: DateTime.UtcNow.AddHours(8),
    signingCredentials: credentials
);
```

**Configuración de Seguridad**:
- Clave secreta de 256 bits
- Algoritmo HMAC-SHA256
- Expiración de 8 horas
- Validación de emisor y audiencia

---

### 4. Arquitectura en Capas

**Decisión**: Implementar arquitectura limpia con separación de responsabilidades.

**Capas**:
```
┌─────────────────────────────────────┐
│     Controllers (API Layer)          │
├─────────────────────────────────────┤
│     Services (Business Logic)        │
├─────────────────────────────────────┤
│     Data (Repository/EF Core)        │
├─────────────────────────────────────┤
│     Models (Domain Entities)         │
└─────────────────────────────────────┘
```

**Beneficios**:
- **Testabilidad**: Cada capa se puede probar independientemente
- **Mantenibilidad**: Cambios aislados por capa
- **Reutilización**: Lógica de negocio reutilizable
- **Separación de Concerns**: Responsabilidades claras

---

### 5. DTOs (Data Transfer Objects)

**Decisión**: Separar modelos de dominio de contratos de API usando DTOs.

**Razones**:
- **Seguridad**: No exponer directamente las entidades del dominio
- **Flexibilidad**: Contratos de API independientes del modelo de datos
- **Versionado**: Facilita el versionado de la API
- **Validación**: Validaciones específicas para cada operación

**Ejemplo**:
```csharp
// Entity (Dominio)
public class TodoItem {
    public int Id { get; set; }
    public User User { get; set; } // Relación compleja
    // Campos internos
}

// DTO (API)
public class TodoItemDto {
    public int Id { get; set; }
    public string Title { get; set; }
    // Solo lo necesario para el cliente
}
```

---

### 6. Middleware de Manejo de Errores

**Decisión**: Centralizar el manejo de excepciones en un middleware.

**Razones**:
- **Consistencia**: Todas las respuestas de error tienen el mismo formato
- **DRY**: Evita repetir try-catch en cada controlador
- **Logging**: Punto único para registrar errores
- **Seguridad**: Evita exponer detalles internos al cliente

**Implementación**:
```csharp
public class ErrorHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado");
            await HandleExceptionAsync(context, ex);
        }
    }
}
```

---

### 7. Validaciones con Data Annotations

**Decisión**: Usar Data Annotations en lugar de FluentValidation.

**Razones**:
- **Simplicidad**: Más simple para este proyecto
- **Integración**: Funciona nativamente con ASP.NET Core
- **Declarativo**: Validaciones visibles en el modelo

**Ejemplo**:
```csharp
public class CreateTodoItemDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [MaxLength(200)]
    public string Title { get; set; }
}
```

**Trade-offs**:
- ❌ Menos flexible que FluentValidation
- ✅ Más simple y legible
- ✅ Suficiente para validaciones básicas

---

### 8. Logging Estructurado

**Decisión**: Implementar logging en todos los servicios.

**Razones**:
- **Debugging**: Facilita la identificación de problemas
- **Auditoría**: Registro de operaciones importantes
- **Monitoreo**: Permite monitorear el comportamiento de la aplicación

**Niveles de Log**:
- `Information`: Operaciones exitosas (login, crear tarea)
- `Warning`: Intentos fallidos (login incorrecto)
- `Error`: Excepciones y errores

---

### 9. Swagger/OpenAPI

**Decisión**: Incluir Swagger UI para documentación interactiva.

**Razones**:
- **Documentación Automática**: Se genera automáticamente del código
- **Pruebas**: Permite probar la API sin herramientas externas
- **Estándar**: OpenAPI es un estándar de la industria
- **Desarrollo**: Facilita el desarrollo del frontend

**Configuración**:
```csharp
builder.Services.AddSwaggerGen();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

---

### 10. Patrón Repository/Service

**Decisión**: Implementar servicios con interfaces para inyección de dependencias.

**Estructura**:
```csharp
public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    
    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }
}
```

**Beneficios**:
- **Testabilidad**: Fácil mockear con Moq
- **Dependency Injection**: Inversión de control
- **Flexibilidad**: Fácil cambiar implementaciones

---

## Decisiones Frontend

### 1. Angular 19

**Decisión**: Usar la última versión de Angular.

**Razones**:
- Cumple con requisitos (Angular 17+)
- Standalone components por defecto
- Mejoras de rendimiento
- Signals para reactividad

---

### 2. NgRx para Estado Global

**Decisión**: Usar NgRx en lugar de servicios con BehaviorSubject.

**Razones**:
- **Predecibilidad**: Flujo unidireccional de datos
- **DevTools**: Herramientas de debugging excelentes
- **Escalabilidad**: Facilita el crecimiento de la aplicación
- **Testing**: Más fácil probar

**Estructura**:
```
store/
├── actions/
├── reducers/
├── effects/
└── selectors/
```

---

### 3. Angular Material

**Decisión**: Usar Angular Material para componentes UI.

**Razones**:
- **Consistencia**: Diseño Material Design
- **Accesibilidad**: Componentes accesibles por defecto
- **Mantenido**: Oficial de Angular
- **Responsive**: Funciona en todos los dispositivos

---

### 4. Lazy Loading

**Decisión**: Implementar lazy loading para módulos de funcionalidades.

**Razones**:
- **Performance**: Carga inicial más rápida
- **Bundle**: Bundles más pequeños
- **UX**: Mejor experiencia de usuario

---

### 5. HTTP Interceptors

**Decisión**: Usar interceptors para agregar el token JWT automáticamente.

**Razones**:
- **DRY**: No repetir código en cada petición
- **Centralizado**: Punto único de configuración
- **Manejo de Errores**: Interceptar errores globalmente

---

## Seguridad

### Implementaciones

1. **Passwords Hasheadas**: BCrypt con salt automático
2. **JWT**: Tokens firmados y con expiración
3. **HTTPS**: Forzado en producción
4. **CORS**: Configurado específicamente para el frontend
5. **Validaciones**: Input validation en todos los endpoints
6. **SQL Injection**: Prevenido por EF Core (parametrized queries)

---

## Rendimiento

### Optimizaciones Backend

1. **Async/Await**: Todas las operaciones I/O son asíncronas
2. **LINQ Optimizado**: Queries eficientes con EF Core
3. **DTOs**: Reducir payload de respuestas
4. **Paginación**: Preparado para implementar (comentado en mejoras futuras)

### Optimizaciones Frontend (Planeadas)

1. **TrackBy**: En todas las listas ngFor
2. **OnPush**: Change detection strategy
3. **Lazy Loading**: Módulos cargados bajo demanda
4. **Virtual Scrolling**: Para listas grandes

---

## Escalabilidad

### Preparación para Escalar

1. **Stateless API**: JWT permite escalabilidad horizontal
2. **Docker Ready**: Fácil containerizar
3. **Cloud Ready**: Compatible con Azure/AWS
4. **Microservicios**: Arquitectura permite separar en microservicios

### Futuras Mejoras

- Load Balancer
- Cache distribuido (Redis)
- Message Queue (RabbitMQ)
- Base de datos replicada

---

## Mantenibilidad

### Prácticas Implementadas

1. **Código Limpio**: Nombres descriptivos, funciones pequeñas
2. **Comentarios**: Donde agregan valor
3. **Documentación**: XML comments en métodos públicos
4. **Tests**: 13 pruebas unitarias
5. **Logging**: Para debugging
6. **Versionado**: Preparado para versionado de API

---

## Herramientas y Librerías

### Backend
- **BCrypt.Net**: Hash de contraseñas
- **System.IdentityModel.Tokens.Jwt**: Autenticación JWT
- **Swashbuckle**: Documentación OpenAPI
- **xUnit**: Framework de pruebas
- **Moq**: Mocking en pruebas

### Frontend (Planeado)
- **@ngrx/store**: Estado global
- **@ngrx/effects**: Side effects
- **@angular/material**: Componentes UI
- **RxJS**: Programación reactiva

---

## Patrones de Diseño Utilizados

1. **Repository Pattern**: Abstracción de acceso a datos
2. **Dependency Injection**: Inversión de control
3. **Factory Pattern**: En creación de respuestas API
4. **Middleware Pattern**: Pipeline de request/response
5. **DTO Pattern**: Transferencia de datos
6. **Singleton**: Servicios registrados como Scoped

---

## Conclusión

Las decisiones técnicas tomadas priorizan:

✅ **Simplicidad**: Fácil de entender y mantener  
✅ **Testabilidad**: Cobertura de pruebas  
✅ **Escalabilidad**: Preparado para crecer  
✅ **Seguridad**: Mejores prácticas aplicadas  
✅ **Rendimiento**: Optimizaciones implementadas  

El proyecto está construido siguiendo principios SOLID y mejores prácticas de la industria, siendo un excelente punto de partida para una aplicación de producción.

---

**Autor**: Equipo de Desarrollo TodoApp  
**Fecha**: Enero 2025  
**Versión**: 1.0
