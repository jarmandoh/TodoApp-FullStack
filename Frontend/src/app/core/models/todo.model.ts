export interface TodoItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export enum TodoPriority {
  Low = 0,
  Medium = 1,
  High = 2
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate?: string | null;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: TodoPriority;
  dueDate?: string | null;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}
