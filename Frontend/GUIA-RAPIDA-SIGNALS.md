# ⚡ Guía Rápida: Migración de BehaviorSubject a Signals

Esta es una guía de referencia rápida para migrar servicios de BehaviorSubject a Signals.

## 📋 Checklist de Migración

### Paso 1: Actualizar Imports
```typescript
// ❌ Antes
import { BehaviorSubject, Observable } from 'rxjs';

// ✅ Después
import { signal, computed, Signal, WritableSignal } from '@angular/core';
```

### Paso 2: Reemplazar BehaviorSubject

```typescript
// ❌ Antes
private userSubject = new BehaviorSubject<User | null>(null);
public user$ = this.userSubject.asObservable();

// ✅ Después
private userSignal: WritableSignal<User | null> = signal(null);
public user: Signal<User | null> = this.userSignal.asReadonly();
```

### Paso 3: Actualizar Actualizaciones

```typescript
// ❌ Antes
this.userSubject.next(newUser);

// ✅ Después
this.userSignal.set(newUser);

// 💡 Para actualizaciones basadas en valor anterior
this.userSignal.update(current => ({ ...current, name: 'New Name' }));
```

### Paso 4: Reemplazar Getters de Valor

```typescript
// ❌ Antes
get currentUser(): User | null {
  return this.userSubject.value;
}

// ✅ Después
get currentUser(): User | null {
  return this.userSignal();
}
```

### Paso 5: Agregar Computed Signals

```typescript
// ✨ Nuevo - Computed signals para valores derivados
public isAuthenticated: Signal<boolean> = computed(() => 
  !!this.userSignal()
);

public userName: Signal<string> = computed(() => 
  this.userSignal()?.name ?? 'Guest'
);
```

---

## 🔄 Patrones de Conversión Comunes

### Observable con Pipe
```typescript
// ❌ Antes
user$ = this.userSubject.asObservable().pipe(
  map(user => user?.name),
  filter(name => !!name)
);

// ✅ Después
userName = computed(() => {
  const user = this.userSignal();
  return user?.name ?? null;
});
```

### CombineLatest
```typescript
// ❌ Antes
combined$ = combineLatest([this.user$, this.settings$]).pipe(
  map(([user, settings]) => ({ user, settings }))
);

// ✅ Después
combined = computed(() => ({
  user: this.userSignal(),
  settings: this.settingsSignal()
}));
```

### Subscribe para Side Effects
```typescript
// ❌ Antes
this.user$.subscribe(user => {
  console.log('User changed:', user);
});

// ✅ Después
effect(() => {
  const user = this.userSignal();
  console.log('User changed:', user);
});
```

---

## 🎯 Uso en Componentes

### Template Syntax

```typescript
// ❌ Antes (con async pipe)
@Component({
  template: `
    <div *ngIf="user$ | async as user">
      {{ user.name }}
    </div>
  `
})

// ✅ Después (con signals)
@Component({
  template: `
    @if (user()) {
      <div>{{ user()!.name }}</div>
    }
  `
})
```

### Component Class

```typescript
// ❌ Antes
export class MyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  user: User | null = null;
  
  ngOnInit() {
    this.subscription = this.service.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// ✅ Después
export class MyComponent {
  service = inject(MyService);
  // ¡Acceso directo al signal, sin suscripción!
  // usar en template: {{ service.user()?.name }}
}
```

---

## 🎨 Patrones Avanzados

### Estado Complejo

```typescript
interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ❌ Antes
private stateSubject = new BehaviorSubject<AppState>({
  user: null,
  loading: false,
  error: null
});

// ✅ Después - Opción 1: Un signal
private state = signal<AppState>({
  user: null,
  loading: false,
  error: null
});

// ✅ Después - Opción 2: Signals separados (recomendado)
private user = signal<User | null>(null);
private loading = signal(false);
private error = signal<string | null>(null);
```

### Computed Signals Complejos

```typescript
// Derivar múltiples valores
fullName = computed(() => {
  const user = this.userSignal();
  return user ? `${user.firstName} ${user.lastName}` : '';
});

initials = computed(() => {
  const name = this.fullName();
  return name.split(' ').map(n => n[0]).join('');
});

// Computed con lógica condicional
displayMessage = computed(() => {
  const user = this.userSignal();
  const loading = this.loadingSignal();
  
  if (loading) return 'Cargando...';
  if (!user) return 'No hay usuario';
  return `Bienvenido, ${user.name}`;
});
```

### Effects con Cleanup

```typescript
constructor() {
  effect((onCleanup) => {
    const user = this.userSignal();
    
    if (user) {
      // Setup
      const timer = setInterval(() => {
        console.log('Heartbeat for', user.name);
      }, 5000);
      
      // Cleanup
      onCleanup(() => {
        clearInterval(timer);
      });
    }
  });
}
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: Olvidar llamar al signal como función
```typescript
// ❌ Mal
const user = authService.currentUser;

// ✅ Bien
const user = authService.currentUser();
```

### Error 2: Intentar modificar un signal de solo lectura
```typescript
// ❌ Mal (si currentUser es Signal<T>)
authService.currentUser.set(newUser); // Error!

// ✅ Bien - debe ser WritableSignal o tener método público
private currentUserSignal = signal(null);
public currentUser = this.currentUserSignal.asReadonly();

setUser(user: User) {
  this.currentUserSignal.set(user);
}
```

### Error 3: Usar effects para actualizar signals (ciclo infinito)
```typescript
// ❌ Mal - puede causar ciclo infinito
effect(() => {
  const user = this.userSignal();
  this.otherSignal.set(user); // NO!
});

// ✅ Bien - usa computed
otherValue = computed(() => {
  return this.userSignal();
});
```

### Error 4: Effects fuera del contexto de inyección
```typescript
// ❌ Mal
export class MyService {
  constructor() {
    // Esto puede funcionar
  }
  
  someMethod() {
    effect(() => { ... }); // Error! Fuera de injection context
  }
}

// ✅ Bien - usar en constructor o con injector explícito
constructor(private injector: Injector) {
  // OK
}

someMethod() {
  runInInjectionContext(this.injector, () => {
    effect(() => { ... });
  });
}
```

---

## 📊 Tabla de Equivalencias

| RxJS (BehaviorSubject) | Signals | Notas |
|------------------------|---------|-------|
| `new BehaviorSubject(value)` | `signal(value)` | Inicialización |
| `subject.next(value)` | `signal.set(value)` | Actualización completa |
| - | `signal.update(fn)` | Actualización basada en valor anterior |
| `subject.value` | `signal()` | Leer valor actual |
| `subject.asObservable()` | `signal.asReadonly()` | Exponer solo lectura |
| `pipe(map(...))` | `computed(...)` | Transformación |
| `combineLatest([...])` | `computed(...)` | Combinar múltiples |
| `subscribe(...)` | `effect(...)` | Side effects |
| `unsubscribe()` | - | No necesario (automático) |

---

## ✅ Ventajas de Signals

1. ✨ **Menos código**: No más subscribe/unsubscribe
2. ⚡ **Mejor performance**: Change detection optimizado
3. 🛡️ **Type-safe**: Mejor inferencia de tipos
4. 🧹 **Sin memory leaks**: Cleanup automático
5. 📖 **Más legible**: Sintaxis más simple
6. 🎯 **Granular updates**: Solo actualiza lo necesario

---

## 📚 Recursos

- [Documentación Oficial de Angular Signals](https://angular.dev/guide/signals)
- [Guía de Migración (este proyecto)](./MIGRACION-SIGNALS.md)
- [Ejemplos de Código](./EJEMPLOS-SIGNALS.md)
- [Componente de Ejemplo](./src/app/shared/components/user-profile-example/)

---

## 🎯 Cuándo Usar Signals vs RxJS

### Usa Signals para:
- ✅ Estado local de componentes
- ✅ Estado de servicios simples
- ✅ Valores que cambian síncronamente
- ✅ Computed values
- ✅ UI state management

### Usa RxJS para:
- ✅ HTTP requests (async operations)
- ✅ WebSocket streams
- ✅ Eventos del DOM complejos
- ✅ Operadores complejos (debounce, throttle, etc.)
- ✅ Cuando necesitas operadores específicos de RxJS

### Usa Ambos:
- ✅ Convierte Observables a Signals con `toSignal()`
- ✅ Convierte Signals a Observables con `toObservable()`

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable -> Signal
data = toSignal(this.http.get('/api/data'));

// Signal -> Observable
data$ = toObservable(this.dataSignal);
```

---

**Última actualización:** 3 de diciembre de 2025
