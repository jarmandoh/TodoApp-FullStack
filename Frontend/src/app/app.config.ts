import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { todosReducer } from './store/todos/todos.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { TodosEffects } from './store/todos/todos.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      todos: todosReducer
    }),
    provideEffects([AuthEffects, TodosEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    })
  ]
};
