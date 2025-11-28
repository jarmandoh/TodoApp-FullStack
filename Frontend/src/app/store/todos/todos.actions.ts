import { createAction, props } from '@ngrx/store';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest, TodoStats } from '../../core/models';

// Load Todos
export const loadTodos = createAction('[Todos] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todos] Load Todos Success',
  props<{ todos: TodoItem[] }>()
);

export const loadTodosFailure = createAction(
  '[Todos] Load Todos Failure',
  props<{ error: string }>()
);

// Load Todo by ID
export const loadTodoById = createAction(
  '[Todos] Load Todo By Id',
  props<{ id: number }>()
);

export const loadTodoByIdSuccess = createAction(
  '[Todos] Load Todo By Id Success',
  props<{ todo: TodoItem }>()
);

export const loadTodoByIdFailure = createAction(
  '[Todos] Load Todo By Id Failure',
  props<{ error: string }>()
);

// Create Todo
export const createTodo = createAction(
  '[Todos] Create Todo',
  props<{ todo: CreateTodoRequest }>()
);

export const createTodoSuccess = createAction(
  '[Todos] Create Todo Success',
  props<{ todo: TodoItem }>()
);

export const createTodoFailure = createAction(
  '[Todos] Create Todo Failure',
  props<{ error: string }>()
);

// Update Todo
export const updateTodo = createAction(
  '[Todos] Update Todo',
  props<{ id: number; todo: UpdateTodoRequest }>()
);

export const updateTodoSuccess = createAction(
  '[Todos] Update Todo Success',
  props<{ todo: TodoItem }>()
);

export const updateTodoFailure = createAction(
  '[Todos] Update Todo Failure',
  props<{ error: string }>()
);

// Delete Todo
export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ id: number }>()
);

export const deleteTodoSuccess = createAction(
  '[Todos] Delete Todo Success',
  props<{ id: number }>()
);

export const deleteTodoFailure = createAction(
  '[Todos] Delete Todo Failure',
  props<{ error: string }>()
);

// Toggle Complete
export const toggleComplete = createAction(
  '[Todos] Toggle Complete',
  props<{ id: number; isCompleted: boolean }>()
);

export const toggleCompleteSuccess = createAction(
  '[Todos] Toggle Complete Success',
  props<{ todo: TodoItem }>()
);

export const toggleCompleteFailure = createAction(
  '[Todos] Toggle Complete Failure',
  props<{ error: string }>()
);

// Load Stats
export const loadStats = createAction('[Todos] Load Stats');

export const loadStatsSuccess = createAction(
  '[Todos] Load Stats Success',
  props<{ stats: TodoStats }>()
);

export const loadStatsFailure = createAction(
  '[Todos] Load Stats Failure',
  props<{ error: string }>()
);

// Filter
export const setFilter = createAction(
  '[Todos] Set Filter',
  props<{ filter: 'all' | 'completed' | 'pending' }>()
);
