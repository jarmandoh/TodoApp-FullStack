import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
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
    <h2 mat-dialog-title>Cambiar Contraseña</h2>
    <mat-dialog-content>
      <div class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contraseña Actual</mat-label>
          <input 
            matInput 
            [type]="hideCurrentPassword() ? 'password' : 'text'"
            [(ngModel)]="currentPassword" 
            placeholder="Contraseña actual">
          <mat-icon matPrefix>lock</mat-icon>
          <button 
            mat-icon-button 
            matSuffix 
            (click)="hideCurrentPassword.set(!hideCurrentPassword())"
            type="button">
            <mat-icon>{{ hideCurrentPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nueva Contraseña</mat-label>
          <input 
            matInput 
            [type]="hideNewPassword() ? 'password' : 'text'"
            [(ngModel)]="newPassword" 
            placeholder="Nueva contraseña (mínimo 6 caracteres)">
          <mat-icon matPrefix>lock_open</mat-icon>
          <button 
            mat-icon-button 
            matSuffix 
            (click)="hideNewPassword.set(!hideNewPassword())"
            type="button">
            <mat-icon>{{ hideNewPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirmar Nueva Contraseña</mat-label>
          <input 
            matInput 
            [type]="hideConfirmPassword() ? 'password' : 'text'"
            [(ngModel)]="confirmPassword" 
            placeholder="Confirmar nueva contraseña">
          <mat-icon matPrefix>lock_open</mat-icon>
          <button 
            mat-icon-button 
            matSuffix 
            (click)="hideConfirmPassword.set(!hideConfirmPassword())"
            type="button">
            <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
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
        {{ loading() ? 'Cambiando...' : 'Cambiar Contraseña' }}
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
export class ChangePasswordDialogComponent {
  private dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private authService = inject(AuthService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  error = signal('');
  success = signal('');

  async onSave() {
    this.error.set('');
    this.success.set('');

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.error.set('Todos los campos son requeridos');
      return;
    }

    if (this.newPassword.length < 6) {
      this.error.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    try {
      const result = await this.authService.changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      });

      if (result && result.success) {
        this.success.set('Contraseña cambiada exitosamente');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      } else {
        this.error.set(result?.message || 'No se pudo cambiar la contraseña');
      }
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Error al cambiar la contraseña');
    } finally {
      this.loading.set(false);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
