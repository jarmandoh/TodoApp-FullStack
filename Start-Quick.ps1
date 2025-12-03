# Script para iniciar TodoApp Full-Stack con todas las funcionalidades

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Iniciando TodoApp Full-Stack" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "[1/5] Verificando dependencias..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

$dotnetVersion = dotnet --version 2>$null
if ($null -eq $dotnetVersion) {
    Write-Host "Error: .NET no está instalado" -ForegroundColor Red
    exit 1
}
Write-Host "  .NET: $dotnetVersion" -ForegroundColor Green

# Verificar si el puerto 5001 está en uso
Write-Host ""
Write-Host "[2/5] Verificando puertos..." -ForegroundColor Yellow
$backendPort = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "  Puerto 5001 en uso, cerrando proceso..." -ForegroundColor Yellow
    $processId = $backendPort.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}
Write-Host "  Puerto 5001: Disponible" -ForegroundColor Green

$frontendPort = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "  Puerto 4200 en uso, cerrando proceso..." -ForegroundColor Yellow
    $processId = $frontendPort.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}
Write-Host "  Puerto 4200: Disponible" -ForegroundColor Green

# Verificar dependencias del Frontend
Write-Host ""
Write-Host "[3/5] Verificando dependencias del Frontend..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $PSScriptRoot "Frontend\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "  Instalando dependencias de Node.js..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\Frontend"
    npm install
    Set-Location $PSScriptRoot
}
Write-Host "  Dependencias del Frontend: OK" -ForegroundColor Green

# Iniciar Backend
Write-Host ""
Write-Host "[4/5] Iniciando Backend (.NET)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '=====================================' -ForegroundColor Cyan; " +
    "Write-Host '  Backend - TodoApp API' -ForegroundColor Cyan; " +
    "Write-Host '=====================================' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd '$PSScriptRoot\Backend\TodoApp.API'; " +
    "dotnet run"

# Esperar a que el backend esté listo
Write-Host "  Esperando a que el backend inicie..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Verificar que el backend está corriendo
try {
    $null = Invoke-WebRequest -Uri "http://localhost:5001" -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  Backend iniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "  Backend iniciando (puede tardar unos segundos más)" -ForegroundColor Yellow
}

# Iniciar Frontend
Write-Host ""
Write-Host "[5/5] Iniciando Frontend (Angular)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host '=====================================' -ForegroundColor Cyan; " +
    "Write-Host '  Frontend - Angular App' -ForegroundColor Cyan; " +
    "Write-Host '=====================================' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd '$PSScriptRoot\Frontend'; " +
    "npm start"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Aplicación Iniciada Exitosamente" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend API:  " -NoNewline; Write-Host "http://localhost:5001" -ForegroundColor Yellow
Write-Host "  Frontend App: " -NoNewline; Write-Host "http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "Funcionalidades Implementadas:" -ForegroundColor Cyan
Write-Host "  ✓ Autenticación JWT" -ForegroundColor White
Write-Host "  ✓ CRUD de Tareas con Prioridades" -ForegroundColor White
Write-Host "  ✓ Sistema de Búsqueda en Tiempo Real" -ForegroundColor White
Write-Host "  ✓ Notificaciones de Tareas" -ForegroundColor White
Write-Host "  ✓ Tema Oscuro/Claro" -ForegroundColor White
Write-Host "  ✓ Edición de Perfil" -ForegroundColor White
Write-Host "  ✓ Cambio de Contraseña" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "  Email:    admin@todoapp.com" -ForegroundColor White
Write-Host "  Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener los servicios" -ForegroundColor Gray
Write-Host ""
