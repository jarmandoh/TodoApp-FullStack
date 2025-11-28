# Script de Inicio Rápido - TodoApp
# PowerShell Script para Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    TodoApp - Prueba Técnica Angular" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para mostrar menú
function Show-Menu {
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "1. Ejecutar Backend (.NET API)"
    Write-Host "2. Ejecutar Pruebas Backend"
    Write-Host "3. Ejecutar Frontend (Angular)"
    Write-Host "4. Ejecutar Backend Y Frontend"
    Write-Host "5. Ver Swagger (requiere backend ejecutándose)"
    Write-Host "6. Compilar Todo"
    Write-Host "7. Limpiar y Reconstruir"
    Write-Host "8. Ver Estado del Proyecto"
    Write-Host "9. Salir"
    Write-Host ""
}

# Función para ejecutar backend
function Start-Backend {
    Write-Host "Iniciando Backend (.NET API)..." -ForegroundColor Green
    Set-Location "Backend\TodoApp.API"
    Write-Host "API disponible en: https://localhost:5001" -ForegroundColor Cyan
    Write-Host "Swagger UI: https://localhost:5001" -ForegroundColor Cyan
    Write-Host ""
    dotnet run
    Set-Location ..\..
}

# Función para ejecutar pruebas
function Start-Tests {
    Write-Host "Ejecutando Pruebas Unitarias..." -ForegroundColor Green
    Set-Location "Backend\TodoApp.Tests"
    dotnet test --verbosity normal
    Set-Location ..\..
    Write-Host ""
    Read-Host "Presiona Enter para continuar"
}

# Función para ejecutar frontend
function Start-Frontend {
    Write-Host "Iniciando Frontend (Angular)..." -ForegroundColor Green
    Set-Location "Frontend"
    Write-Host "Aplicación disponible en: http://localhost:4200" -ForegroundColor Cyan
    Write-Host ""
    npm start
    Set-Location ..
}

# Función para abrir Swagger
function Open-Swagger {
    Write-Host "Abriendo Swagger UI en el navegador..." -ForegroundColor Green
    Start-Process "https://localhost:5001"
}

# Función para compilar todo
function Build-All {
    Write-Host "Compilando Backend..." -ForegroundColor Green
    Set-Location "Backend\TodoApp.API"
    dotnet build
    Set-Location ..\..
    
    Write-Host ""
    Write-Host "Instalando dependencias Frontend..." -ForegroundColor Green
    Set-Location "Frontend"
    npm install
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Compilación completada!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar"
}

# Función para limpiar y reconstruir
function Clean-Rebuild {
    Write-Host "Limpiando Backend..." -ForegroundColor Yellow
    Set-Location "Backend\TodoApp.API"
    dotnet clean
    dotnet build
    Set-Location ..\..
    
    Write-Host ""
    Write-Host "Limpiando Frontend..." -ForegroundColor Yellow
    Set-Location "Frontend"
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    npm install
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Reconstrucción completada!" -ForegroundColor Green
    Read-Host "Presiona Enter para continuar"
}

# Función para mostrar estado
function Show-Status {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "      Estado del Proyecto" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Backend (.NET):" -ForegroundColor Yellow
    Write-Host "  ✅ API completa implementada"
    Write-Host "  ✅ 7 endpoints funcionando"
    Write-Host "  ✅ 13 pruebas unitarias"
    Write-Host "  ✅ Autenticación JWT"
    Write-Host "  ✅ Swagger integrado"
    Write-Host ""
    
    Write-Host "Frontend (Angular):" -ForegroundColor Yellow
    Write-Host "  ✅ Proyecto inicializado"
    Write-Host "  ✅ Angular Material instalado"
    Write-Host "  ✅ NgRx instalado"
    Write-Host "  ⏳ Componentes por implementar"
    Write-Host ""
    
    Write-Host "Documentación:" -ForegroundColor Yellow
    Write-Host "  ✅ README.md"
    Write-Host "  ✅ RESUMEN.md"
    Write-Host "  ✅ INICIO-RAPIDO.md"
    Write-Host "  ✅ DECISIONES-TECNICAS.md"
    Write-Host "  ✅ CHECKLIST.md"
    Write-Host ""
    
    Write-Host "Usuarios de Prueba:" -ForegroundColor Yellow
    Write-Host "  📧 admin@todoapp.com / Admin123!"
    Write-Host "  📧 user@todoapp.com / User123!"
    Write-Host ""
    
    Read-Host "Presiona Enter para continuar"
}

# Bucle principal
do {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    TodoApp - Prueba Técnica" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Show-Menu
    $opcion = Read-Host "Opción"
    
    switch ($opcion) {
        '1' {
            Clear-Host
            Start-Backend
        }
        '2' {
            Clear-Host
            Start-Tests
        }
        '3' {
            Clear-Host
            Start-Frontend
        }
        '4' {
            Clear-Host
            Write-Host "Iniciando Backend y Frontend..." -ForegroundColor Green
            Write-Host "Se abrirán dos ventanas de terminal" -ForegroundColor Yellow
            Write-Host ""
            
            # Iniciar backend en nueva ventana
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Backend\TodoApp.API'; dotnet run"
            
            # Esperar unos segundos
            Start-Sleep -Seconds 3
            
            # Iniciar frontend en nueva ventana
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Frontend'; npm start"
            
            Write-Host "✅ Backend y Frontend iniciados!" -ForegroundColor Green
            Write-Host "Backend: https://localhost:5001" -ForegroundColor Cyan
            Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
            Write-Host ""
            Read-Host "Presiona Enter para continuar"
        }
        '5' {
            Open-Swagger
            Start-Sleep -Seconds 2
        }
        '6' {
            Clear-Host
            Build-All
        }
        '7' {
            Clear-Host
            Clean-Rebuild
        }
        '8' {
            Clear-Host
            Show-Status
        }
        '9' {
            Write-Host ""
            Write-Host "¡Hasta luego! 👋" -ForegroundColor Green
            break
        }
        default {
            Write-Host "Opción no válida" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
} while ($opcion -ne '9')
