import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TodoItem, TodoPriority } from '../../../../core/models';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo!: TodoItem;
  @Output() toggleComplete = new EventEmitter<TodoItem>();
  @Output() edit = new EventEmitter<TodoItem>();
  @Output() delete = new EventEmitter<TodoItem>();

  TodoPriority = TodoPriority;

  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo);
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  onDelete(): void {
    this.delete.emit(this.todo);
  }

  getPriorityLabel(priority: TodoPriority): string {
    switch (priority) {
      case TodoPriority.High:
        return 'Alta';
      case TodoPriority.Medium:
        return 'Media';
      case TodoPriority.Low:
        return 'Baja';
      default:
        return 'Media';
    }
  }

  getPriorityColor(priority: TodoPriority): string {
    switch (priority) {
      case TodoPriority.High:
        return 'warn';
      case TodoPriority.Medium:
        return 'accent';
      case TodoPriority.Low:
        return 'primary';
      default:
        return 'accent';
    }
  }

  isOverdue(): boolean {
    if (!this.todo.dueDate || this.todo.isCompleted) {
      return false;
    }
    return new Date(this.todo.dueDate) < new Date();
  }
}
