import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '../../../../core/models';
import * as TodosActions from '../../../../store/todos/todos.actions';
import * as TodosSelectors from '../../../../store/todos/todos.selectors';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonToggleModule,
    TodoItemComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  todos$ = this.store.select(TodosSelectors.selectFilteredTodos);
  loading$ = this.store.select(TodosSelectors.selectTodosLoading);
  filter$ = this.store.select(TodosSelectors.selectTodosFilter);

  ngOnInit(): void {
    this.store.dispatch(TodosActions.loadTodos());
  }

  onFilterChange(filter: 'all' | 'completed' | 'pending'): void {
    this.store.dispatch(TodosActions.setFilter({ filter }));
  }

  onAddTodo(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: CreateTodoRequest) => {
      if (result) {
        this.store.dispatch(TodosActions.createTodo({ todo: result }));
      }
    });
  }

  onEditTodo(todo: TodoItem): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      data: { todo }
    });

    dialogRef.afterClosed().subscribe((result: UpdateTodoRequest) => {
      if (result) {
        this.store.dispatch(TodosActions.updateTodo({ 
          id: todo.id, 
          todo: result 
        }));
      }
    });
  }

  onToggleComplete(todo: TodoItem): void {
    this.store.dispatch(TodosActions.toggleComplete({ 
      id: todo.id, 
      isCompleted: !todo.isCompleted 
    }));
  }

  onDeleteTodo(todo: TodoItem): void {
    if (confirm(`¿Estás seguro de eliminar la tarea "${todo.title}"?`)) {
      this.store.dispatch(TodosActions.deleteTodo({ id: todo.id }));
    }
  }

  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id;
  }
}
