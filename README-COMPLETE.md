# 🚀 TodoApp Full-Stack - Complete Edition

[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?logo=angular)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Material](https://img.shields.io/badge/Material-Design-757575?logo=material-design)](https://material.angular.io/)

> Aplicación completa de gestión de tareas con Angular 17+ y .NET 10, implementando autenticación JWT, NgRx, Angular Signals, sistema de notificaciones, búsqueda en tiempo real, tema oscuro y más.

---

## ✨ Características Principales

### 🎯 Funcionalidades Core
- **🔐 Autenticación JWT**: Login seguro con tokens y hash de contraseñas
- **📝 CRUD Completo**: Crear, leer, actualizar y eliminar tareas
- **⚡ Prioridades**: Tareas con prioridad Alta, Media y Baja
- **📅 Fechas de Vencimiento**: Asignación de fechas límite
- **📊 Dashboard**: Estadísticas en tiempo real

### 🆕 Funcionalidades Avanzadas
- **🔍 Búsqueda en Tiempo Real**: Filtrado instantáneo de tareas
- **🌓 Tema Oscuro/Claro**: Toggle completo con CSS para todos los componentes
- **🔔 Sistema de Notificaciones**: Backend + Frontend con actualización automática
- **👤 Edición de Perfil**: Actualizar nombre y email del usuario
- **🔒 Cambio de Contraseña**: Con validación y confirmación

---

## 🏗️ Tecnologías

### Backend
- **.NET 10** - Framework principal
- **Entity Framework Core** - ORM con InMemory Database
- **JWT Authentication** - Tokens seguros
- **BCrypt** - Hash de contraseñas
- **Swagger** - Documentación API

### Frontend
- **Angular 17+** - Framework con Standalone Components
- **Angular Signals** - Sistema reactivo moderno
- **NgRx** - State management global
- **Angular Material** - UI Components
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ y npm
- .NET SDK 8.0+
- Visual Studio Code (recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jarmandoh/TodoApp-FullStack.git
cd TodoApp-FullStack

# Instalar dependencias del Frontend
cd Frontend
npm install
cd ..
```

### Ejecución

**Opción 1: Script Automático (Recomendado)**
```powershell
.\Start-Quick.ps1
```

**Opción 2: Manual**
```bash
# Terminal 1 - Backend
cd Backend/TodoApp.API
dotnet run

# Terminal 2 - Frontend
cd Frontend
npm start
```

### Acceso
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5001
- **Credenciales de prueba**:
  - Email: `admin@todoapp.com`
  - Password: `Admin123!`

---

## 📁 Estructura del Proyecto

```
TodoApp-FullStack/
├── Backend/
│   └── TodoApp.API/
│       ├── Controllers/      # Auth, Todos, Notifications
│       ├── Services/         # Lógica de negocio
│       ├── Models/           # Entidades (User, TodoItem, Notification)
│       ├── DTOs/             # Data Transfer Objects
│       └── Data/             # DbContext y configuración
├── Frontend/
│   └── src/
│       ├── app/
│       │   ├── core/         # Guards, Interceptors, Services, Models
│       │   ├── features/     # Auth, Todos, Profile
│       │   ├── shared/       # Layout, Navbar
│       │   └── store/        # NgRx (Auth, Todos)
│       └── environments/     # Configuración por ambiente
└── Documentation/
    ├── FUNCIONALIDADES-COMPLETAS.md
    ├── IMPLEMENTACION-COMPLETA.md
    └── MIGRACION-SIGNALS.md
```

---

## 🎯 Funcionalidades Detalladas

### 1. Sistema de Búsqueda
- Búsqueda en tiempo real mientras se escribe
- Filtrado por título y descripción
- Integración con NgRx Store
- Barra expandible en navbar

### 2. Tema Oscuro
- Toggle en navbar
- CSS completo para todos los componentes Material
- Animaciones suaves de transición
- Soporte para: cards, inputs, buttons, dialogs, menus, etc.

### 3. Notificaciones
- Backend: Modelo, Service, Controller con 4 endpoints
- Frontend: Service + integración en navbar
- Badge con contador de no leídas
- Actualización automática cada 30 segundos
- Sistema de detección de tareas próximas a vencer

### 4. Gestión de Perfil
- Página de perfil con información del usuario
- Diálogo modal para editar nombre y email
- Validación de email único
- Actualización en tiempo real del estado

### 5. Cambio de Contraseña
- Diálogo modal dedicado
- Validación de contraseña actual
- Confirmación de nueva contraseña
- Toggle show/hide password
- Hash seguro con BCrypt

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Autenticación de usuario
- `PUT /api/auth/update-profile` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

### Tareas
- `GET /api/todos` - Listar todas las tareas
- `GET /api/todos/{id}` - Obtener una tarea
- `POST /api/todos` - Crear nueva tarea
- `PUT /api/todos/{id}` - Actualizar tarea
- `DELETE /api/todos/{id}` - Eliminar tarea
- `GET /api/todos/stats` - Obtener estadísticas

### Notificaciones
- `GET /api/notifications` - Listar notificaciones
- `GET /api/notifications/unread-count` - Contador de no leídas
- `POST /api/notifications/{id}/mark-read` - Marcar como leída
- `POST /api/notifications/mark-all-read` - Marcar todas

---

## 🧪 Pruebas

### Backend
```bash
cd Backend/TodoApp.Tests
dotnet test
```

### Frontend
```bash
cd Frontend
ng test
```

---

## 📊 Estadísticas del Proyecto

- **Backend**: 3 Controladores, 3 Servicios, 3 Modelos, ~2,800 líneas
- **Frontend**: 22 Componentes, 6 Servicios, 2 Store modules, ~4,500 líneas
- **Total**: ~7,300 líneas de código
- **Endpoints REST**: 16
- **Funcionalidades**: 15+

---

## 📚 Documentación Adicional

- [Funcionalidades Completas](./FUNCIONALIDADES-COMPLETAS.md) - Detalle de todas las features
- [Implementación Completa](./IMPLEMENTACION-COMPLETA.md) - Resumen de la implementación
- [Migración a Signals](./MIGRACION-SIGNALS.md) - Guía de Angular Signals
- [Inicio Rápido](./INICIO-RAPIDO.md) - Guía de inicio rápido
- [Vista General](./VISTA-GENERAL.md) - Vista general del proyecto

---

## 🎨 Capturas de Pantalla

### Login
![Login](./docs/screenshots/login.png)

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)

### Lista de Tareas
![Lista de Tareas](./docs/screenshots/todo-list.png)

### Tema Oscuro
![Tema Oscuro](./docs/screenshots/dark-theme.png)

---

## 🏆 Características Técnicas Destacadas

- **Angular Signals**: Migración completa de BehaviorSubject a Signals
- **NgRx Best Practices**: Actions, Reducers, Effects, Selectors con memoización
- **Standalone Components**: Arquitectura moderna de Angular
- **Material Design**: Sistema de diseño completo
- **Responsive CSS**: Adaptable a todos los dispositivos
- **Type Safety**: TypeScript en modo estricto
- **Security**: JWT + BCrypt + Guards + Interceptors
- **Clean Architecture**: Separación de responsabilidades

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**TodoApp Team**

- GitHub: [@jarmandoh](https://github.com/jarmandoh)
- Proyecto: [TodoApp-FullStack](https://github.com/jarmandoh/TodoApp-FullStack)

---

## 🙏 Agradecimientos

- Angular Team por el framework
- Microsoft por .NET
- Material Design Team
- NgRx Team
- Comunidad Open Source

---

## 📞 Soporte

Si tienes alguna pregunta o problema:
- Abre un [Issue](https://github.com/jarmandoh/TodoApp-FullStack/issues)
- Consulta la [Documentación](./FUNCIONALIDADES-COMPLETAS.md)
- Revisa los [Ejemplos](./EJEMPLOS-SIGNALS.md)

---

**Versión**: 2.0 Complete Edition  
**Última actualización**: 3 de Diciembre de 2025  
**Estado**: ✅ Producción Ready (con InMemory DB para desarrollo)
