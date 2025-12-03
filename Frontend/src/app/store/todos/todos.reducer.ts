import { createReducer, on } from '@ngrx/store';
import { TodoItem, TodoStats } from '../../core/models';
import * as TodosActions from './todos.actions';

export interface TodosState {
  todos: TodoItem[];
  selectedTodo: TodoItem | null;
  stats: TodoStats | null;
  filter: 'all' | 'completed' | 'pending';
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

export const initialState: TodosState = {
  todos: [],
  selectedTodo: null,
  stats: null,
  filter: 'all',
  searchQuery: '',
  loading: false,
  error: null
};

export const todosReducer = createReducer(
  initialState,
  
  // Load Todos
  on(TodosActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
    error: null
  })),
  
  on(TodosActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Todo by ID
  on(TodosActions.loadTodoById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.loadTodoByIdSuccess, (state, { todo }) => ({
    ...state,
    selectedTodo: todo,
    loading: false,
    error: null
  })),
  
  on(TodosActions.loadTodoByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Todo
  on(TodosActions.createTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.createTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
    loading: false,
    error: null
  })),
  
  on(TodosActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Todo
  on(TodosActions.updateTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.updateTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    selectedTodo: state.selectedTodo?.id === todo.id ? todo : state.selectedTodo,
    loading: false,
    error: null
  })),
  
  on(TodosActions.updateTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Todo
  on(TodosActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.deleteTodoSuccess, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(t => t.id !== id),
    selectedTodo: state.selectedTodo?.id === id ? null : state.selectedTodo,
    loading: false,
    error: null
  })),
  
  on(TodosActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Toggle Complete
  on(TodosActions.toggleComplete, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.toggleCompleteSuccess, (state, { todo }) => ({
    ...state,
    todos: state.todos.map(t => t.id === todo.id ? todo : t),
    loading: false,
    error: null
  })),
  
  on(TodosActions.toggleCompleteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Stats
  on(TodosActions.loadStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TodosActions.loadStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null
  })),
  
  on(TodosActions.loadStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Filter
  on(TodosActions.setFilter, (state, { filter }) => ({
    ...state,
    filter
  })),
  
  // Search
  on(TodosActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query
  })),
  
  on(TodosActions.clearSearch, (state) => ({
    ...state,
    searchQuery: ''
  }))
);
