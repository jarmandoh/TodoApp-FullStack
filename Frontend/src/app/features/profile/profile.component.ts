import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title>Mi Perfil</mat-card-title>
          <mat-card-subtitle>Información de usuario</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content *ngIf="user$ | async as user">
          <div class="profile-info">
            <div class="info-item">
              <mat-icon>person</mat-icon>
              <div class="info-content">
                <span class="info-label">Nombre</span>
                <span class="info-value">{{ user.name }}</span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-item">
              <mat-icon>email</mat-icon>
              <div class="info-content">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="info-item">
              <mat-icon>badge</mat-icon>
              <div class="info-content">
                <span class="info-label">ID de Usuario</span>
                <span class="info-value">{{ user.id }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="openEditDialog()">
            <mat-icon>edit</mat-icon>
            Editar Perfil
          </button>
          <button mat-button (click)="openChangePasswordDialog()">
            <mat-icon>lock</mat-icon>
            Cambiar Contraseña
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-card {
      margin-top: 2rem;
    }

    .profile-avatar {
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #3f51b5;
      }
    }

    .profile-info {
      padding: 1rem 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;

      mat-icon {
        color: #666;
      }

      .info-content {
        display: flex;
        flex-direction: column;
        flex: 1;

        .info-label {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 500;
          color: #333;
        }
      }
    }

    mat-card-actions {
      padding: 1rem;
      display: flex;
      gap: 1rem;

      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      mat-card-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class ProfileComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  
  user$ = this.store.select(AuthSelectors.selectUser);

  openEditDialog(): void {
    this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      disableClose: false
    });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '500px',
      disableClose: false
    });
  }
}
