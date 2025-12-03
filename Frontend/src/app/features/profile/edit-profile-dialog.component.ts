import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Perfil</h2>
    <mat-dialog-content>
      <div class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="name" placeholder="Nombre completo">
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="email" placeholder="correo@ejemplo.com">
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <div *ngIf="error()" class="error-message">
          <mat-icon>error</mat-icon>
          {{ error() }}
        </div>

        <div *ngIf="success()" class="success-message">
          <mat-icon>check_circle</mat-icon>
          {{ success() }}
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="loading()">
        <mat-icon *ngIf="!loading()">save</mat-icon>
        <mat-icon *ngIf="loading()">hourglass_empty</mat-icon>
        {{ loading() ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      min-width: 400px;
      padding: 1rem 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
      padding: 0.5rem;
      background-color: #ffebee;
      border-radius: 4px;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4caf50;
      padding: 0.5rem;
      background-color: #e8f5e9;
      border-radius: 4px;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 768px) {
      .form-container {
        min-width: 300px;
      }
    }
  `]
})
export class EditProfileDialogComponent {
  private dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  private store = inject(Store);
  private authService = inject(AuthService);

  user$ = this.store.select(AuthSelectors.selectUser);

  name = '';
  email = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor() {
    this.user$.subscribe(user => {
      if (user) {
        this.name = user.name;
        this.email = user.email;
      }
    });
  }

  async onSave() {
    this.error.set('');
    this.success.set('');

    if (!this.name.trim() || !this.email.trim()) {
      this.error.set('El nombre y email son requeridos');
      return;
    }

    this.loading.set(true);

    try {
      const result = await this.authService.updateProfile({
        name: this.name,
        email: this.email
      });

      if (result) {
        this.success.set('Perfil actualizado exitosamente');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      } else {
        this.error.set('No se pudo actualizar el perfil');
      }
    } catch (err) {
      this.error.set('Error al actualizar el perfil');
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
