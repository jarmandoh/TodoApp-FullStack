# TodoApp - Frontend (Angular 19)

## 🚀 Descripción

Frontend moderno desarrollado con Angular 19, Angular Material y NgRx para la gestión de estado. Aplicación Full-Stack de gestión de tareas con autenticación JWT.

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema completo de login
- 📝 **Gestión de Tareas** - CRUD completo de todos
- 📊 **Dashboard** - Estadísticas visuales de tareas
- 🎨 **Material Design** - UI moderna y responsive
- 🔄 **NgRx Store** - Gestión de estado predecible
- ⚡ **Lazy Loading** - Carga optimizada de módulos
- 🎯 **OnPush Strategy** - Rendimiento optimizado
- 📱 **Responsive** - Adaptado a todos los dispositivos

## 🛠️ Tecnologías

- **Angular** 19.0.0
- **Angular Material** 19.0.0
- **NgRx** (Store, Effects, DevTools)
- **RxJS** 7.8.0
- **TypeScript** 5.6.0
- **SCSS** para estilos

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 19.x

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Instalar Angular CLI (si no lo tienes)
npm install -g @angular/cli
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
ng serve

# O usando npm
npm start

# La aplicación estará disponible en http://localhost:4200
```

### Modo Producción

```bash
# Compilar para producción
ng build --configuration production

# Los archivos se generarán en la carpeta dist/
```

## 🔌 Configuración del Backend

Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.

El frontend está configurado para conectarse a:
- **Desarrollo**: `https://localhost:5001/api`
- **Producción**: `https://api.todoapp.com/api`

Para cambiar la URL del API, edita:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'  // <-- Cambia aquí
};
```

## 👤 Usuarios de Prueba

```
Admin:
Email: admin@todoapp.com
Password: Admin123!

Usuario:
Email: user@todoapp.com
Password: User123!
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios y utilidades core
│   │   ├── guards/             # Guards de navegación
│   │   ├── interceptors/       # HTTP Interceptors
│   │   ├── models/             # Interfaces y modelos
│   │   └── services/           # Servicios de negocio
│   ├── features/               # Features/Módulos
│   │   ├── auth/              # Módulo de autenticación
│   │   └── todos/             # Módulo de tareas
│   ├── shared/                 # Componentes compartidos
│   │   └── components/        # Navbar, Layout, etc.
│   ├── store/                  # NgRx Store
│   │   ├── auth/              # Estado de autenticación
│   │   └── todos/             # Estado de tareas
│   └── environments/           # Configuraciones de entorno
├── styles.scss                 # Estilos globales
└── index.html                  # HTML principal
```

## 🎨 Componentes Principales

### Auth
- **LoginComponent**: Formulario de inicio de sesión con validaciones

### Todos
- **TodoListComponent**: Lista de tareas con filtros
- **TodoItemComponent**: Item individual de tarea
- **TodoFormComponent**: Formulario crear/editar tarea
- **DashboardComponent**: Dashboard con estadísticas

### Shared
- **NavbarComponent**: Barra de navegación
- **LayoutComponent**: Layout principal de la app

## 🔐 Autenticación

El sistema de autenticación usa JWT (JSON Web Tokens):

1. Usuario ingresa credenciales en LoginComponent
2. AuthService hace POST a `/api/auth/login`
3. Token se guarda en localStorage
4. AuthInterceptor agrega el token a todas las peticiones
5. AuthGuard protege las rutas privadas

## 📊 Gestión de Estado (NgRx)

### Auth Store
```typescript
// State
{
  user: User | null,
  token: string | null,
  loading: boolean,
  error: string | null
}

// Actions
- login
- loginSuccess
- loginFailure
- logout
```

### Todos Store
```typescript
// State
{
  todos: TodoItem[],
  selectedTodo: TodoItem | null,
  stats: TodoStats | null,
  filter: 'all' | 'completed' | 'pending',
  loading: boolean,
  error: string | null
}

// Actions
- loadTodos
- createTodo
- updateTodo
- deleteTodo
- toggleComplete
- loadStats
- setFilter
```

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
ng test

# Ejecutar pruebas con cobertura
ng test --code-coverage

# Ejecutar pruebas E2E
ng e2e
```

## 📦 Build y Deployment

```bash
# Build de producción
ng build --configuration production

# Analizar tamaño del bundle
npm run build:stats
```

## 🎯 Características Implementadas

✅ Autenticación con JWT
✅ CRUD completo de tareas
✅ Dashboard con estadísticas
✅ Filtros de tareas
✅ Diseño responsive
✅ Material Design
✅ Gestión de estado con NgRx
✅ Lazy Loading
✅ OnPush Change Detection
✅ TrackBy en listas
✅ Error handling
✅ Interceptores HTTP

## 🔜 Mejoras Futuras

- [ ] Pruebas unitarias completas
- [ ] Pruebas E2E
- [ ] Paginación de tareas
- [ ] Búsqueda y ordenamiento avanzado
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push

## 🐛 Troubleshooting

### El backend no responde
- Verifica que el backend esté ejecutándose en `https://localhost:5001`
- Revisa la configuración en `environment.ts`

### Error de CORS
- El backend debe tener CORS configurado para `http://localhost:4200`

### Token expirado
- El token JWT expira después de cierto tiempo
- Vuelve a iniciar sesión

## 📝 Licencia

MIT

## 👨‍💻 Autor

TodoApp Full-Stack
