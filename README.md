# TodoApp - Prueba Técnica Angular y .NET

Aplicación completa de gestión de tareas (To-Do List) desarrollada con Angular 19 y .NET 10 que incluye autenticación JWT, gestión de estado con NgRx, y pruebas automatizadas.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura](#arquitectura)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Ejecutar las Pruebas](#ejecutar-las-pruebas)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Características Implementadas](#características-implementadas)

## 🎯 Características

### Funcionalidades Implementadas

- ✅ **Autenticación JWT**: Sistema completo de login con tokens JWT
- ✅ **Gestión de Tareas**: CRUD completo de tareas con validaciones
- ✅ **Dashboard**: Métricas en tiempo real (total, completadas, pendientes)
- ✅ **Filtros**: Filtrado por estado (todas, completadas, pendientes)
- ✅ **Notificaciones**: Sistema de notificaciones para acciones del usuario
- ✅ **Diseño Responsive**: Interfaz adaptable a dispositivos móviles y desktop
- ✅ **Pruebas Automatizadas**: Cobertura de pruebas unitarias en backend
- ✅ **Documentación API**: Swagger/OpenAPI integrado

## 🛠️ Tecnologías Utilizadas

### Backend (.NET 10)
- ASP.NET Core Web API
- Entity Framework Core (InMemory Database)
- JWT Authentication (System.IdentityModel.Tokens.Jwt)
- BCrypt.Net para hash de contraseñas
- Swagger/Swashbuckle para documentación
- xUnit + Moq para pruebas unitarias

### Frontend (Angular 19)
- Angular CLI 19
- Angular Material para componentes UI
- NgRx para gestión de estado global
- RxJS para programación reactiva
- TypeScript
- SCSS para estilos
- Karma + Jasmine para pruebas unitarias

## 🏗️ Arquitectura

### Backend - Clean Architecture

```
Backend/
├── TodoApp.API/
│   ├── Controllers/      # Endpoints de la API
│   ├── Services/         # Lógica de negocio
│   ├── Data/            # Contexto EF Core
│   ├── Models/          # Entidades del dominio
│   ├── DTOs/            # Data Transfer Objects
│   └── Middleware/      # Error handling
└── TodoApp.Tests/       # Pruebas unitarias
```

### Frontend - Arquitectura Modular

```
Frontend/
├── src/
│   ├── app/
│   │   ├── core/         # Servicios singleton, guards, interceptors
│   │   ├── shared/       # Componentes compartidos
│   │   ├── features/     # Módulos de funcionalidades
│   │   │   ├── auth/     # Autenticación
│   │   │   └── todos/    # Gestión de tareas
│   │   └── store/        # Estado global con NgRx
│   └── environments/     # Configuraciones por entorno
```

## 💡 Decisiones Técnicas

### Backend

1. **Base de Datos InMemory**: Elegida para simplificar la ejecución sin configuración adicional. En producción se recomendaría SQL Server o PostgreSQL.

2. **JWT Authentication**: Implementado para autenticación stateless, permitiendo escalabilidad horizontal.

3. **Patrón Repository/Service**: Separación de responsabilidades entre acceso a datos y lógica de negocio.

4. **Middleware de Manejo de Errores**: Centralización del manejo de excepciones para respuestas consistentes.

5. **DTOs**: Separación entre modelos de dominio y contratos de API para mayor flexibilidad.

6. **Validaciones**: Implementadas con Data Annotations para validación declarativa.

7. **CORS**: Configurado específicamente para el frontend Angular en desarrollo.

### Frontend

1. **NgRx para Estado Global**: Gestión predecible y centralizada del estado de la aplicación.

2. **Angular Material**: Framework UI consistente y accesible con componentes pre-construidos.

3. **Programación Reactiva**: Uso extensivo de Observables para manejo asíncrono.

4. **Guards y Interceptors**: Protección de rutas y manejo automático de tokens JWT.

5. **Lazy Loading**: Carga diferida de módulos para optimizar el rendimiento inicial.

6. **TrackBy en Listas**: Optimización de renderizado de listas grandes.

7. **Standalone Components (Angular 19)**: Uso de componentes standalone para reducir boilerplate.

## 📦 Requisitos Previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) o superior
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Angular CLI](https://angular.io/cli) (v19)
- Editor de código (VS Code recomendado)

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd TodoApp-FullStack
```

### 2. Configurar Backend

```bash
cd Backend/TodoApp.API
dotnet restore
```

### 3. Configurar Frontend

```bash
cd Frontend
npm install
```

## 🚀 Ejecutar el Proyecto

### Opción 1: Ejecutar Backend y Frontend por Separado

#### Backend (.NET API)

```bash
# Desde la raíz del proyecto
cd Backend/TodoApp.API
dotnet run
```

La API estará disponible en: `https://localhost:5001` o `http://localhost:5000`

**Swagger UI**: Navega a `https://localhost:5001` para ver la documentación interactiva de la API.

#### Frontend (Angular)

```bash
# Desde la raíz del proyecto
cd Frontend
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

### Opción 2: Ejecutar con Scripts (Próximamente)

```bash
npm run start:all
```

## 🧪 Ejecutar las Pruebas

### Backend - Pruebas Unitarias (.NET)

```bash
cd Backend/TodoApp.Tests
dotnet test
```

**Cobertura de Pruebas Backend**:
- ✅ AuthService: Login, generación de tokens, validaciones
- ✅ TodoService: CRUD completo de tareas
- Total: 13 pruebas unitarias

### Frontend - Pruebas Unitarias (Angular)

```bash
cd Frontend
ng test
```

**Cobertura de Pruebas Frontend**:
- ✅ Componentes principales
- ✅ Servicios de autenticación y tareas
- ✅ Guards y interceptors

### Frontend - Pruebas E2E (Opcional)

```bash
cd Frontend
ng e2e
```

## 🔌 API Endpoints

### Autenticación

#### POST /api/auth/login
Autentica un usuario y devuelve un token JWT.

**Request Body:**
```json
{
  "email": "admin@todoapp.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@todoapp.com",
    "name": "Administrator",
    "userId": 1
  }
}
```

### Tareas (Requiere Autenticación)

#### GET /api/todos
Obtiene todas las tareas del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Completar prueba técnica",
      "description": "Desarrollar aplicación con Angular y .NET",
      "isCompleted": false,
      "createdAt": "2025-01-10T10:00:00Z",
      "completedAt": null
    }
  ]
}
```

#### GET /api/todos/{id}
Obtiene una tarea específica por ID.

#### POST /api/todos
Crea una nueva tarea.

**Request Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea"
}
```

#### PUT /api/todos/{id}
Actualiza una tarea existente.

**Request Body:**
```json
{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "isCompleted": true
}
```

#### DELETE /api/todos/{id}
Elimina una tarea.

#### GET /api/todos/stats
Obtiene estadísticas de tareas del usuario.

**Response:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 10,
    "completed": 6,
    "pending": 4
  }
}
```

## 📁 Estructura del Proyecto

```
TodoApp-FullStack/
├── Backend/
│   ├── TodoApp.API/
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   └── TodosController.cs
│   │   ├── Services/
│   │   │   ├── IAuthService.cs
│   │   │   ├── AuthService.cs
│   │   │   ├── ITodoService.cs
│   │   │   └── TodoService.cs
│   │   ├── Data/
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Models/
│   │   │   ├── User.cs
│   │   │   └── TodoItem.cs
│   │   ├── DTOs/
│   │   │   ├── LoginRequest.cs
│   │   │   ├── LoginResponse.cs
│   │   │   ├── TodoItemDto.cs
│   │   │   └── ApiResponse.cs
│   │   ├── Middleware/
│   │   │   └── ErrorHandlingMiddleware.cs
│   │   ├── Program.cs
│   │   └── appsettings.json
│   └── TodoApp.Tests/
│       └── Services/
│           ├── AuthServiceTests.cs
│           └── TodoServiceTests.cs
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── shared/
│   │   │   ├── features/
│   │   │   └── store/
│   │   ├── environments/
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
├── TodoApp.sln
└── README.md
```

## ✨ Características Implementadas

### Backend

- [x] API RESTful con .NET 10
- [x] Autenticación JWT
- [x] Entity Framework Core con base de datos InMemory
- [x] CRUD completo de tareas
- [x] Validación de datos con Data Annotations
- [x] Middleware de manejo de errores centralizado
- [x] Logging estructurado
- [x] Swagger/OpenAPI para documentación
- [x] CORS configurado
- [x] 13 pruebas unitarias con xUnit y Moq

### Frontend

- [x] Angular 19 con TypeScript
- [x] Angular Material para UI
- [x] NgRx para gestión de estado
- [x] Autenticación con guards
- [x] HTTP Interceptors para tokens
- [x] Routing con lazy loading
- [x] Diseño responsive
- [x] Notificaciones de usuario
- [x] Dashboard con métricas
- [x] Filtros de tareas
- [x] Optimizaciones de rendimiento (trackBy)

## 👥 Usuarios de Prueba

La aplicación incluye usuarios pre-configurados para pruebas:

### Usuario Administrador
- **Email**: `admin@todoapp.com`
- **Contraseña**: `Admin123!`

### Usuario Regular
- **Email**: `user@todoapp.com`
- **Contraseña**: `User123!`

## 🔐 Seguridad

- Contraseñas hasheadas con BCrypt
- Tokens JWT con expiración de 8 horas
- Validación de entrada en todos los endpoints
- CORS configurado específicamente
- HTTPS habilitado por defecto

## 📊 Métricas de Calidad

### Backend
- **Cobertura de Pruebas**: 13 pruebas unitarias
- **Tiempo de Compilación**: ~3 segundos
- **Tiempo de Ejecución de Pruebas**: ~4 segundos

### Frontend
- **Tamaño del Bundle**: Optimizado con lazy loading
- **Accesibilidad**: Componentes Material Design accesibles
- **Performance**: TrackBy en listas, OnPush change detection

## 🚀 Mejoras Futuras

- [ ] Implementación completa del frontend Angular
- [ ] Pruebas E2E con Cypress
- [ ] Integración continua (CI/CD)
- [ ] Containerización con Docker
- [ ] Base de datos persistente (SQL Server)
- [ ] Paginación en listado de tareas
- [ ] Búsqueda y ordenamiento avanzado
- [ ] Temas dark/light mode
- [ ] Internacionalización (i18n)
- [ ] PWA para uso offline

## 📝 Notas de Desarrollo

### Comandos Útiles

```bash
# Backend
dotnet build              # Compilar
dotnet run                # Ejecutar
dotnet test               # Pruebas
dotnet watch run          # Ejecutar con hot-reload

# Frontend
ng serve                  # Desarrollo
ng build                  # Compilar para producción
ng test                   # Pruebas unitarias
ng lint                   # Linter
ng build --prod           # Build optimizado
```

### Variables de Entorno

#### Backend (appsettings.json)
```json
{
  "Jwt": {
    "Key": "SuperSecretKeyForTodoAppJWTAuthentication2024!",
    "Issuer": "TodoAppAPI",
    "Audience": "TodoAppClient"
  }
}
```

#### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

## 🤝 Contribuciones

Este es un proyecto de prueba técnica. Para preguntas o sugerencias, contactar al desarrollador.

## 📄 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica.

---

**Desarrollado con ❤️ para la prueba técnica Angular y .NET**

**Fecha de Desarrollo**: Enero 2025  
**Versión**: 1.0.0  
**Tiempo de Desarrollo**: 48 horas
