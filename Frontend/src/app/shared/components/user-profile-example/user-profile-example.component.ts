import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Componente de ejemplo que demuestra el uso de Angular Signals
 * con el AuthService refactorizado
 * 
 * Este componente muestra diferentes formas de trabajar con signals:
 * 1. Lectura directa en el template
 * 2. Computed signals derivados
 * 3. Effects para reaccionar a cambios
 */
@Component({
  selector: 'app-user-profile-example',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="user-profile-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>account_circle</mat-icon>
          Perfil de Usuario (Signals Example)
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <!-- Uso directo de signals en el template -->
        @if (authService.isAuthenticatedSignal()) {
          <div class="user-info">
            <p><strong>Nombre:</strong> {{ authService.currentUser()?.name }}</p>
            <p><strong>Email:</strong> {{ authService.currentUser()?.email }}</p>
            <p><strong>ID:</strong> {{ authService.currentUser()?.id }}</p>
          </div>

          <mat-divider></mat-divider>

          <!-- Uso de computed signals -->
          <div class="computed-info">
            <h3>Información Derivada (Computed Signals)</h3>
            <p><strong>Nombre Completo:</strong> {{ userDisplayName() }}</p>
            <p><strong>Dominio Email:</strong> {{ emailDomain() }}</p>
            <p><strong>Usuario Activo:</strong> {{ userStatus() }}</p>
          </div>

          <mat-divider></mat-divider>

          <!-- Información adicional -->
          <div class="extra-info">
            <h3>Estado</h3>
            <p>Estado de autenticación: <span class="badge success">Autenticado</span></p>
            <p>Token disponible: <span class="badge success">Sí</span></p>
          </div>
        } @else {
          <div class="no-user">
            <mat-icon>person_off</mat-icon>
            <p>No hay usuario autenticado</p>
          </div>
        }
      </mat-card-content>

      <mat-card-actions>
        @if (authService.isAuthenticatedSignal()) {
          <button mat-raised-button color="warn" (click)="onLogout()">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
        } @else {
          <button mat-raised-button color="primary" routerLink="/auth/login">
            <mat-icon>login</mat-icon>
            Iniciar Sesión
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-profile-card {
      max-width: 600px;
      margin: 2rem auto;
    }

    mat-card-header {
      margin-bottom: 1rem;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-info,
    .computed-info,
    .extra-info {
      margin: 1rem 0;
    }

    .user-info p,
    .computed-info p,
    .extra-info p {
      margin: 0.5rem 0;
    }

    .no-user {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .no-user mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }

    mat-divider {
      margin: 1.5rem 0;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .badge.success {
      background-color: #4caf50;
      color: white;
    }

    mat-card-actions {
      padding: 1rem;
      display: flex;
      justify-content: center;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    h3 {
      color: #3f51b5;
      margin-bottom: 0.5rem;
    }
  `]
})
export class UserProfileExampleComponent {
  // Inyectar el AuthService
  authService = inject(AuthService);

  // Computed signal: Nombre para mostrar del usuario
  userDisplayName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.name} (${user.email})` : 'Invitado';
  });

  // Computed signal: Extraer dominio del email
  emailDomain = computed(() => {
    const user = this.authService.currentUser();
    if (user?.email) {
      const domain = user.email.split('@')[1];
      return domain || 'N/A';
    }
    return 'N/A';
  });

  // Computed signal: Estado del usuario
  userStatus = computed(() => {
    const isAuth = this.authService.isAuthenticatedSignal();
    return isAuth ? '✓ Activo' : '✗ Inactivo';
  });

  constructor() {
    // Effect: Se ejecuta cada vez que cambia el usuario
    effect(() => {
      const user = this.authService.currentUser();
      console.log('👤 Usuario cambió:', user);
      
      if (user) {
        console.log('✅ Usuario autenticado:', user.name);
      } else {
        console.log('❌ No hay usuario autenticado');
      }
    });

    // Effect: Se ejecuta cuando cambia el estado de autenticación
    effect(() => {
      const isAuth = this.authService.isAuthenticatedSignal();
      console.log('🔐 Estado de autenticación:', isAuth ? 'Autenticado' : 'No autenticado');
    });
  }

  onLogout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
  }
}
