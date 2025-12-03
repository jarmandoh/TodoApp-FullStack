# Ejemplos de Uso de Signals en AuthService

Este documento contiene ejemplos prácticos de cómo usar los signals del AuthService en diferentes escenarios.

## 📚 Tabla de Contenidos

1. [Uso Básico en Templates](#uso-básico-en-templates)
2. [Computed Signals](#computed-signals)
3. [Effects para Reaccionar a Cambios](#effects-para-reaccionar-a-cambios)
4. [Guards con Signals](#guards-con-signals)
5. [Componentes con Change Detection OnPush](#componentes-con-change-detection-onpush)
6. [Integración con Forms](#integración-con-forms)

---

## Uso Básico en Templates

### Ejemplo 1: Mostrar información del usuario

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header>
      @if (authService.isAuthenticatedSignal()) {
        <div class="user-menu">
          <span>Hola, {{ authService.currentUser()?.name }}</span>
          <button (click)="logout()">Cerrar sesión</button>
        </div>
      } @else {
        <a routerLink="/auth/login">Iniciar sesión</a>
      }
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
```

### Ejemplo 2: Navegación condicional

```typescript
@Component({
  selector: 'app-nav',
  template: `
    <nav>
      <a routerLink="/home">Inicio</a>
      
      @if (authService.isAuthenticatedSignal()) {
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/profile">Perfil</a>
        <a routerLink="/settings">Configuración</a>
      }
    </nav>
  `
})
export class NavComponent {
  authService = inject(AuthService);
}
```

---

## Computed Signals

Los computed signals son ideales para valores derivados que dependen del estado del usuario.

### Ejemplo 3: Initiales del usuario

```typescript
import { Component, inject, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `
    <div class="avatar" [style.background-color]="avatarColor()">
      {{ userInitials() }}
    </div>
  `,
  styles: [`
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
  `]
})
export class AvatarComponent {
  private authService = inject(AuthService);

  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user?.name) return '?';
    
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });

  avatarColor = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '#cccccc';
    
    // Generar color basado en el ID del usuario
    const hue = (user.id * 137) % 360;
    return `hsl(${hue}, 65%, 50%)`;
  });
}
```

### Ejemplo 4: Permisos y roles

```typescript
@Component({
  selector: 'app-admin-panel',
  template: `
    @if (canAccessAdmin()) {
      <div class="admin-panel">
        <h2>Panel de Administración</h2>
        <!-- Contenido del panel -->
      </div>
    } @else {
      <p>No tienes permisos para acceder a esta sección.</p>
    }
  `
})
export class AdminPanelComponent {
  private authService = inject(AuthService);

  // Nota: Esto es un ejemplo. Necesitarías agregar un campo 'role' al modelo User
  canAccessAdmin = computed(() => {
    const user = this.authService.currentUser();
    // return user?.role === 'admin'; // Si tuvieras roles
    return !!user; // Por ahora solo verificamos autenticación
  });

  isOwner = computed(() => {
    const user = this.authService.currentUser();
    // return user?.role === 'owner';
    return !!user;
  });
}
```

### Ejemplo 5: Estado de suscripción

```typescript
@Component({
  selector: 'app-premium-feature',
  template: `
    <div class="feature-card">
      <h3>Función Premium</h3>
      
      @if (isPremiumUser()) {
        <button mat-raised-button color="primary">
          Acceder a la función
        </button>
      } @else {
        <div class="upgrade-prompt">
          <p>Esta función está disponible para usuarios premium</p>
          <button mat-raised-button color="accent">
            Actualizar a Premium
          </button>
        </div>
      }
    </div>
  `
})
export class PremiumFeatureComponent {
  private authService = inject(AuthService);

  // Nota: Necesitarías un campo 'isPremium' en el modelo User
  isPremiumUser = computed(() => {
    const user = this.authService.currentUser();
    // return user?.isPremium ?? false;
    return !!user; // Placeholder
  });

  daysUntilExpiration = computed(() => {
    const user = this.authService.currentUser();
    // if (!user?.premiumExpirationDate) return null;
    // const diff = new Date(user.premiumExpirationDate).getTime() - Date.now();
    // return Math.ceil(diff / (1000 * 60 * 60 * 24));
    return null; // Placeholder
  });
}
```

---

## Effects para Reaccionar a Cambios

Los effects se ejecutan automáticamente cuando cambian los signals que utilizan.

### Ejemplo 6: Analytics y tracking

```typescript
import { Component, inject, effect } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    // Track user authentication changes
    effect(() => {
      const user = this.authService.currentUser();
      
      if (user) {
        // Enviar evento a analytics
        console.log('Analytics: User logged in', {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        });
        
        // Puedes integrar con servicios reales:
        // this.analytics.setUserId(user.id);
        // this.analytics.logEvent('user_login');
      } else {
        console.log('Analytics: User logged out');
        // this.analytics.clearUserId();
        // this.analytics.logEvent('user_logout');
      }
    });
  }
}
```

### Ejemplo 7: Sincronización con WebSocket

```typescript
import { Component, inject, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | null = null;

  connect(userId: number) {
    this.socket = new WebSocket(`ws://example.com/ws?userId=${userId}`);
    console.log('WebSocket connected for user:', userId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      console.log('WebSocket disconnected');
    }
  }
}

@Component({
  selector: 'app-root',
  template: `<router-outlet />`
})
export class AppComponent {
  private authService = inject(AuthService);
  private wsService = inject(WebSocketService);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      
      if (user) {
        this.wsService.connect(user.id);
      } else {
        this.wsService.disconnect();
      }
    });
  }
}
```

### Ejemplo 8: Actualizar configuración de la app

```typescript
@Component({
  selector: 'app-root',
  template: `<router-outlet />`
})
export class AppComponent {
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      
      // Aplicar preferencias del usuario
      if (user) {
        // this.applyUserTheme(user.preferences?.theme);
        // this.applyUserLanguage(user.preferences?.language);
        // this.enableNotifications(user.preferences?.notifications);
        console.log('Aplicando preferencias del usuario:', user.id);
      } else {
        // Aplicar configuración por defecto
        console.log('Aplicando configuración por defecto');
      }
    });
  }
}
```

---

## Guards con Signals

### Ejemplo 9: Guard de autenticación mejorado

```typescript
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usar el signal directamente
  if (authService.isAuthenticatedSignal()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
```

### Ejemplo 10: Guard de roles

```typescript
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const user = authService.currentUser();
  
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  // if (user.role !== requiredRole) {
  //   router.navigate(['/forbidden']);
  //   return false;
  // }

  return true;
};

// Uso en las rutas:
// {
//   path: 'admin',
//   component: AdminComponent,
//   canActivate: [roleGuard],
//   data: { role: 'admin' }
// }
```

---

## Componentes con Change Detection OnPush

Los signals funcionan perfectamente con OnPush, mejorando el rendimiento.

### Ejemplo 11: Lista de items del usuario

```typescript
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="dashboard">
      <h1>Dashboard de {{ displayName() }}</h1>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Email</h3>
          <p>{{ userEmail() }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Estado</h3>
          <p>{{ accountStatus() }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Desde</h3>
          <p>{{ memberSince() }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent {
  private authService = inject(AuthService);

  displayName = computed(() => {
    return this.authService.currentUser()?.name || 'Usuario';
  });

  userEmail = computed(() => {
    return this.authService.currentUser()?.email || 'No disponible';
  });

  accountStatus = computed(() => {
    return this.authService.isAuthenticatedSignal() ? '✅ Activo' : '❌ Inactivo';
  });

  memberSince = computed(() => {
    // Si tuvieras un campo createdAt en User:
    // const user = this.authService.currentUser();
    // return user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    return 'Diciembre 2024';
  });
}
```

---

## Integración con Forms

### Ejemplo 12: Auto-completar con datos del usuario

```typescript
import { Component, inject, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name">
      </mat-form-field>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email">
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" 
              [disabled]="!profileForm.valid">
        Guardar Cambios
      </button>
    </form>
  `
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  profileForm!: FormGroup;

  constructor() {
    // Effect para actualizar el formulario cuando cambia el usuario
    effect(() => {
      const user = this.authService.currentUser();
      if (user && this.profileForm) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    
    this.profileForm = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Actualizando perfil:', this.profileForm.value);
      // Llamar a un servicio para actualizar el perfil
    }
  }
}
```

---

## 🎯 Mejores Prácticas

1. **Usa `computed()` para valores derivados**: No recalcules valores en cada render
2. **Usa `effect()` para side effects**: Como llamadas a APIs, analytics, etc.
3. **Mantén signals privados cuando sea posible**: Expón solo las APIs necesarias
4. **No mutes signals fuera del servicio**: Mantén la lógica centralizada
5. **Combina con OnPush**: Para máximo rendimiento
6. **Evita lógica compleja en templates**: Usa computed signals en su lugar

## 📊 Comparación: RxJS vs Signals

| Característica | RxJS (BehaviorSubject) | Signals |
|----------------|------------------------|---------|
| Suscripción manual | Requerida | No necesaria |
| Async pipe | Requerido en templates | No necesario |
| Memory leaks | Posibles si no te desuscribes | No hay |
| Performance | Buena | Excelente |
| Curva de aprendizaje | Media-Alta | Baja |
| Boilerplate | Más código | Menos código |

---

## 🚀 Próximos Pasos

- Considera migrar otros servicios a signals
- Explora `@ngrx/signals` para estado global
- Integra con Angular Material y otras librerías
- Implementa caching inteligente con signals

