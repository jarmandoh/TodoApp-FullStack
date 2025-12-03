import { Component, OnInit, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TodoItem, TodoPriority, CreateTodoRequest, UpdateTodoRequest } from '../../../../core/models';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<TodoFormComponent>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });

  todoForm!: FormGroup;
  isEditMode = false;
  priorities = [
    { value: TodoPriority.Low, label: 'Baja' },
    { value: TodoPriority.Medium, label: 'Media' },
    { value: TodoPriority.High, label: 'Alta' }
  ];

  ngOnInit(): void {
    this.isEditMode = !!this.data?.todo;
    this.initForm();
  }

  private initForm(): void {
    const todo = this.data?.todo as TodoItem | undefined;

    this.todoForm = this.fb.group({
      title: [todo?.title || '', [Validators.required, Validators.maxLength(200)]],
      description: [todo?.description || '', Validators.maxLength(1000)],
      priority: [todo?.priority ?? TodoPriority.Medium, Validators.required],
      dueDate: [todo?.dueDate ? new Date(todo.dueDate) : null]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const result = {
        ...formValue,
        dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    const control = this.todoForm.get(field);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    
    return '';
  }
}
