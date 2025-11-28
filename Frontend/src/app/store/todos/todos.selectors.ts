import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(
  selectTodosState,
  (state) => state.todos
);

export const selectFilteredTodos = createSelector(
  selectTodosState,
  (state) => {
    switch (state.filter) {
      case 'completed':
        return state.todos.filter(todo => todo.isCompleted);
      case 'pending':
        return state.todos.filter(todo => !todo.isCompleted);
      default:
        return state.todos;
    }
  }
);

export const selectSelectedTodo = createSelector(
  selectTodosState,
  (state) => state.selectedTodo
);

export const selectTodosStats = createSelector(
  selectTodosState,
  (state) => state.stats
);

export const selectTodosFilter = createSelector(
  selectTodosState,
  (state) => state.filter
);

export const selectTodosLoading = createSelector(
  selectTodosState,
  (state) => state.loading
);

export const selectTodosError = createSelector(
  selectTodosState,
  (state) => state.error
);

export const selectTodoById = (id: number) => createSelector(
  selectAllTodos,
  (todos) => todos.find(todo => todo.id === id)
);
