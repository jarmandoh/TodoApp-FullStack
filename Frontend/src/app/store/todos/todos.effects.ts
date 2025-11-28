import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../core/services/todo.service';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodosEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      exhaustMap(() =>
        this.todoService.getTodos().pipe(
          map(response => {
            if (response.success) {
              return TodosActions.loadTodosSuccess({ todos: response.data });
            }
            return TodosActions.loadTodosFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.loadTodosFailure({ 
              error: error.error?.message || 'Error al cargar tareas' 
            }))
          )
        )
      )
    )
  );

  loadTodoById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodoById),
      exhaustMap(({ id }) =>
        this.todoService.getTodoById(id).pipe(
          map(response => {
            if (response.success) {
              return TodosActions.loadTodoByIdSuccess({ todo: response.data });
            }
            return TodosActions.loadTodoByIdFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.loadTodoByIdFailure({ 
              error: error.error?.message || 'Error al cargar tarea' 
            }))
          )
        )
      )
    )
  );

  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.createTodo),
      exhaustMap(({ todo }) =>
        this.todoService.createTodo(todo).pipe(
          map(response => {
            if (response.success) {
              return TodosActions.createTodoSuccess({ todo: response.data });
            }
            return TodosActions.createTodoFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.createTodoFailure({ 
              error: error.error?.message || 'Error al crear tarea' 
            }))
          )
        )
      )
    )
  );

  createTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodosActions.createTodoSuccess),
        tap(() => {
          this.snackBar.open('Tarea creada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        })
      ),
    { dispatch: false }
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.updateTodo),
      exhaustMap(({ id, todo }) =>
        this.todoService.updateTodo(id, todo).pipe(
          map(response => {
            if (response.success) {
              return TodosActions.updateTodoSuccess({ todo: response.data });
            }
            return TodosActions.updateTodoFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.updateTodoFailure({ 
              error: error.error?.message || 'Error al actualizar tarea' 
            }))
          )
        )
      )
    )
  );

  updateTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodosActions.updateTodoSuccess),
        tap(() => {
          this.snackBar.open('Tarea actualizada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        })
      ),
    { dispatch: false }
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      exhaustMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(response => {
            if (response.success) {
              return TodosActions.deleteTodoSuccess({ id });
            }
            return TodosActions.deleteTodoFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.deleteTodoFailure({ 
              error: error.error?.message || 'Error al eliminar tarea' 
            }))
          )
        )
      )
    )
  );

  deleteTodoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TodosActions.deleteTodoSuccess),
        tap(() => {
          this.snackBar.open('Tarea eliminada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        })
      ),
    { dispatch: false }
  );

  toggleComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.toggleComplete),
      exhaustMap(({ id, isCompleted }) =>
        this.todoService.toggleComplete(id, isCompleted).pipe(
          map(response => {
            if (response.success) {
              return TodosActions.toggleCompleteSuccess({ todo: response.data });
            }
            return TodosActions.toggleCompleteFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.toggleCompleteFailure({ 
              error: error.error?.message || 'Error al actualizar tarea' 
            }))
          )
        )
      )
    )
  );

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadStats),
      exhaustMap(() =>
        this.todoService.getStats().pipe(
          map(response => {
            if (response.success) {
              return TodosActions.loadStatsSuccess({ stats: response.data });
            }
            return TodosActions.loadStatsFailure({ error: response.message });
          }),
          catchError((error) =>
            of(TodosActions.loadStatsFailure({ 
              error: error.error?.message || 'Error al cargar estadísticas' 
            }))
          )
        )
      )
    )
  );

  // Reload stats after any todo modification
  reloadStatsOnChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodosActions.createTodoSuccess,
        TodosActions.updateTodoSuccess,
        TodosActions.deleteTodoSuccess,
        TodosActions.toggleCompleteSuccess
      ),
      map(() => TodosActions.loadStats())
    )
  );
}
