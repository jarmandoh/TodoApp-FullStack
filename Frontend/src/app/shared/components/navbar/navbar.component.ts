import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import * as AuthActions from '../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import * as TodosActions from '../../../store/todos/todos.actions';
import * as TodosSelectors from '../../../store/todos/todos.selectors';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  user$ = this.store.select(AuthSelectors.selectUser);
  stats$ = this.store.select(TodosSelectors.selectTodosStats);
  
  // Contador de tareas pendientes
  pendingCount$ = this.stats$.pipe(
    map(stats => stats?.pending || 0)
  );

  // Notificaciones reales
  notificationCount = signal(0);
  
  // Modo oscuro
  darkMode = signal(false);
  
  // Búsqueda
  searchQuery = signal('');
  showSearchBar = signal(false);

  ngOnInit(): void {
    this.loadNotificationCount();
    // Actualizar cada 30 segundos
    setInterval(() => this.loadNotificationCount(), 30000);
  }

  private loadNotificationCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationCount.set(response.data || 0);
        }
      },
      error: () => {
        // Silenciar errores en segundo plano
      }
    });
  }

  toggleDarkMode(): void {
    this.darkMode.update(value => !value);
    // Aquí puedes agregar lógica para aplicar tema oscuro
    document.body.classList.toggle('dark-theme', this.darkMode());
  }

  toggleSearch(): void {
    this.showSearchBar.update(value => !value);
    if (!this.showSearchBar()) {
      this.searchQuery.set('');
    }
  }

  onSearch(): void {
    const query = this.searchQuery();
    this.store.dispatch(TodosActions.setSearchQuery({ query }));
    
    // Navegar a la lista de tareas si no estamos ya ahí
    if (!this.router.url.includes('/todos')) {
      this.router.navigate(['/todos']);
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Ocultar notificaciones en la pantalla de login
  showNotifications(): boolean {
    try {
      const url = this.router.url || '';
      return !url.includes('/auth/login');
    } catch {
      return true;
    }
  }

  viewNotifications(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notificationCount.set(0);
      }
    });
    // TODO: Abrir diálogo o navegar a página de notificaciones
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
