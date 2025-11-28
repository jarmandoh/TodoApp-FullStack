import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import * as TodosActions from '../../../../store/todos/todos.actions';
import * as TodosSelectors from '../../../../store/todos/todos.selectors';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  stats$ = this.store.select(TodosSelectors.selectTodosStats);
  loading$ = this.store.select(TodosSelectors.selectTodosLoading);
  user$ = this.store.select(AuthSelectors.selectUser);

  ngOnInit(): void {
    this.store.dispatch(TodosActions.loadStats());
  }

  getCompletionPercentage(stats: any): number {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
