import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  TodoItem, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  TodoStats,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor() {}

  getTodos(): Observable<ApiResponse<TodoItem[]>> {
    return this.http.get<ApiResponse<TodoItem[]>>(this.apiUrl);
  }

  getTodoById(id: number): Observable<ApiResponse<TodoItem>> {
    return this.http.get<ApiResponse<TodoItem>>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoRequest): Observable<ApiResponse<TodoItem>> {
    return this.http.post<ApiResponse<TodoItem>>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: UpdateTodoRequest): Observable<ApiResponse<TodoItem>> {
    return this.http.put<ApiResponse<TodoItem>>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  toggleComplete(id: number, isCompleted: boolean): Observable<ApiResponse<TodoItem>> {
    return this.updateTodo(id, { isCompleted });
  }

  getStats(): Observable<ApiResponse<TodoStats>> {
    return this.http.get<ApiResponse<TodoStats>>(`${this.apiUrl}/stats`);
  }
}
