import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(
  selectTodosState,
  (state) => state.todos
);

export const selectSearchQuery = createSelector(
  selectTodosState,
  (state) => state.searchQuery
);

export const selectFilteredTodos = createSelector(
  selectTodosState,
  (state) => {
    let filtered = state.todos;
    
    // Apply filter
    switch (state.filter) {
      case 'completed':
        filtered = filtered.filter(todo => todo.isCompleted);
        break;
      case 'pending':
        filtered = filtered.filter(todo => !todo.isCompleted);
        break;
    }
    
    // Apply search
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(query) ||
        (todo.description?.toLowerCase().includes(query))
      );
    }
    
    return filtered;
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
