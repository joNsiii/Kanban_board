import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  http = inject(HttpClient);
  router = inject(Router);
  baseUrl = 'http://127.0.0.1:8000/';
  messages: string = '';
  messageVisible = false;

  login(body: any) {
    return this.http.post(this.baseUrl + 'login/', body);
  }

  register(body: any) {
    return this.http.post(this.baseUrl + 'register/', body);
  }

  getUserList() {
    return this.http.get(this.baseUrl + 'users/');
  }

  getTodos() {
    return this.http.get(this.baseUrl + 'todo/');
  }

  postTodos(body: any) {
    return this.http.post(this.baseUrl + 'todo/', body);
  }

  updateTodo(body: any, id: number) {
    return this.http.put(this.baseUrl + `todo/${id}/`, body);
  }

  logout(body: any) {
    return this.http.post(this.baseUrl + 'logout/', body);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + `todo/${id}/`);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigateByUrl('login');
          }
        }
        return throwError(() => err);
      })
    );
  }

  showMessage(message: string) {
    this.messages = message;
    if (this.messages !== '') {
      this.messageVisible = true;
      setTimeout(() => {
        this.messageVisible = false;
        this.messages = '';
      }, 3000);
    }
  }
}
