# Migración a Angular Signals en AuthService

## Cambios Realizados

Se ha actualizado el `AuthService` para usar **Angular Signals** en lugar de `BehaviorSubject` de RxJS. Esta migración aprovecha las nuevas características de Angular 17+ para un mejor rendimiento y una API más simple.

## Cambios en el AuthService

### Antes (BehaviorSubject)
```typescript
private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
public currentUser$ = this.currentUserSubject.asObservable();

get currentUserValue(): User | null {
  return this.currentUserSubject.value;
}

// Actualización
this.currentUserSubject.next(user);
```

### Después (Signals)
```typescript
private currentUserSignal: WritableSignal<User | null> = signal(this.getUserFromStorage());

// Signal de solo lectura para uso externo
public currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

// Computed signal para verificar autenticación
public isAuthenticatedSignal: Signal<boolean> = computed(() => !!this.currentUserSignal());

get currentUserValue(): User | null {
  return this.currentUserSignal();
}

// Actualización
this.currentUserSignal.set(user);
```

## Cómo Usar los Signals

### 1. Leer el usuario actual en un componente

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      <h1>Perfil de {{ authService.currentUser()?.username }}</h1>
      <p>Email: {{ authService.currentUser()?.email }}</p>
      
      @if (authService.isAuthenticatedSignal()) {
        <p>Usuario autenticado</p>
      }
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
}
```

### 2. Usar en lógica del componente

```typescript
import { Component, inject, effect } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({...})
export class MyComponent {
  private authService = inject(AuthService);

  constructor() {
    // Effect que se ejecuta cuando cambia el usuario
    effect(() => {
      const user = this.authService.currentUser();
      console.log('Usuario cambió:', user);
    });
  }

  someMethod() {
    // Leer el valor actual
    const currentUser = this.authService.currentUser();
    const isAuth = this.authService.isAuthenticatedSignal();
    
    if (isAuth) {
      console.log('Usuario:', currentUser?.username);
    }
  }
}
```

### 3. Computed signals derivados

```typescript
import { Component, inject, computed } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({...})
export class MyComponent {
  private authService = inject(AuthService);

  // Crear un computed signal basado en el usuario actual
  userDisplayName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.username} (${user.email})` : 'Invitado';
  });

  isAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.role === 'admin';
  });
}
```

## Ventajas de Usar Signals

1. **Mejor Performance**: Angular puede optimizar automáticamente las actualizaciones del DOM
2. **API más Simple**: No necesitas subscribirte/unsubscribirse manualmente
3. **Change Detection Optimizado**: Solo se actualizan los componentes que usan el signal
4. **Type Safety**: Mejor inferencia de tipos en TypeScript
5. **Menos Boilerplate**: No necesitas `async` pipe en templates

## Compatibilidad

Se mantuvieron los siguientes métodos para compatibilidad con código existente:

- `isAuthenticated` (getter): Continúa funcionando igual
- `currentUserValue` (getter): Ahora usa signals internamente
- `getToken()`: Sin cambios
- `login()`: Sin cambios en la firma
- `logout()`: Sin cambios en la firma

## Estado del Proyecto

✅ **AuthService migrado a Signals**
✅ **Compatibilidad mantenida con código existente**
✅ **Guards y interceptors continúan funcionando**
✅ **Effects de NgRx continúan funcionando**

Los componentes de la aplicación actualmente usan **NgRx Store** para el estado de autenticación, por lo que no se requieren cambios adicionales en los componentes en este momento.

## Migración Futura (Opcional)

Si deseas migrar completamente de NgRx Store a Signals, considera:

1. Crear un **Signal Store** para autenticación
2. Reemplazar selectors de NgRx con computed signals
3. Reemplazar effects con lógica en el servicio usando signals
4. Actualizar componentes para usar signals directamente

Ejemplo de Signal Store:
```typescript
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user });
    },
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },
    setError(error: string | null) {
      patchState(store, { error });
    }
  }))
);
```
