# 🚀 Inicio Rápido - TodoApp

## ⚡ Ejecutar el Proyecto en 3 Pasos

### 1️⃣ Iniciar el Backend

```bash
cd Backend/TodoApp.API
dotnet run
```

✅ **API disponible en**: `https://localhost:5001`  
📚 **Swagger UI**: `https://localhost:5001` (se abre automáticamente)

### 2️⃣ Probar la API con Swagger

1. Abrir navegador en `https://localhost:5001`
2. Expandir **POST /api/auth/login**
3. Hacer clic en "Try it out"
4. Usar estas credenciales:
   ```json
   {
     "email": "admin@todoapp.com",
     "password": "Admin123!"
   }
   ```
5. Copiar el **token** de la respuesta
6. Hacer clic en el botón **Authorize** (arriba a la derecha)
7. Pegar: `Bearer {tu-token-aqui}`
8. ¡Ahora puedes probar todos los endpoints!

### 3️⃣ Ejecutar las Pruebas

```bash
cd Backend/TodoApp.Tests
dotnet test
```

✅ **Resultado esperado**: 13 pruebas pasadas

---

## 🎯 Endpoints Principales

### 🔐 Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@todoapp.com",
  "password": "Admin123!"
}
```

### 📝 Tareas (requiere token)

```http
# Listar todas las tareas
GET /api/todos
Authorization: Bearer {token}

# Crear nueva tarea
POST /api/todos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Mi nueva tarea",
  "description": "Descripción detallada"
}

# Actualizar tarea
PUT /api/todos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "description": "Nueva descripción",
  "isCompleted": true
}

# Eliminar tarea
DELETE /api/todos/1
Authorization: Bearer {token}

# Ver estadísticas
GET /api/todos/stats
Authorization: Bearer {token}
```

---

## 👥 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@todoapp.com | Admin123! | Administrador |
| user@todoapp.com | User123! | Usuario |

---

## 🧪 Probar con cURL

### Login
```bash
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@todoapp.com\",\"password\":\"Admin123!\"}" \
  -k
```

### Obtener Tareas
```bash
curl -X GET https://localhost:5001/api/todos \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -k
```

---

## 🧰 Comandos Útiles

```bash
# Backend
dotnet build              # Compilar
dotnet run                # Ejecutar
dotnet test               # Pruebas
dotnet watch run          # Hot reload

# Limpiar y reconstruir
dotnet clean
dotnet build
```

---

## 📦 Estructura de Respuestas

Todas las respuestas tienen este formato:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { /* datos aquí */ },
  "errors": null
}
```

---

## 🐛 Solución de Problemas

### Puerto ocupado
```bash
# Cambiar puerto en launchSettings.json o usar:
dotnet run --urls "https://localhost:5001"
```

### Certificado SSL
```bash
# Confiar en el certificado de desarrollo
dotnet dev-certs https --trust
```

### Base de datos
La base de datos InMemory se reinicia cada vez que se ejecuta la aplicación.  
Los usuarios de prueba se crean automáticamente al iniciar.

---

## ✨ Características Implementadas

- ✅ Autenticación JWT
- ✅ CRUD completo de tareas
- ✅ Validaciones de entrada
- ✅ Manejo de errores centralizado
- ✅ Logging
- ✅ Documentación Swagger
- ✅ 13 pruebas unitarias
- ✅ CORS configurado

---

## 📖 Documentación Completa

Ver **README.md** para documentación detallada.

---

¡Listo para empezar! 🎉
