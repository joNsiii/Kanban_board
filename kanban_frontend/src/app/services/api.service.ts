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

  /**
   * Sends a login request to the server.
   *
   * @param {object} body - The login credentials and other necessary data.
   * @returns An observable that emits the server's response.
   */
  login(body: any) {
    return this.http.post(this.baseUrl + 'login/', body);
  }

  /**
   * Sends a register request to the server.
   *
   * @param {object} body - The login credentials and other necessary data.
   * @returns  An observable that emits the server's response.
   */
  register(body: any) {
    return this.http.post(this.baseUrl + 'register/', body);
  }

  /**
   *
   * @returns An observable that emits the server's response.
   */
  getUserList() {
    return this.http.get(this.baseUrl + 'users/');
  }

  /**
   *
   * @returns An observable that emits the server's response.
   */
  getTodos() {
    return this.http.get(this.baseUrl + 'todo/');
  }

  /**
   *
   * @returns An observable that emits the server's response.
   */
  postTodos(body: any) {
    return this.http.post(this.baseUrl + 'todo/', body);
  }

  /**
   *
   * @param {object} body - The login credentials and other necessary data.
   * @param {number } id - Todo-id
   * @returns An observable that emits the server's response.
   */
  updateTodo(body: any, id: number) {
    return this.http.put(this.baseUrl + `todo/${id}/`, body);
  }

  /**
   *
   * @param body
   * @returns An observable that emits the server's response.
   */
  logout(body: any) {
    return this.http.post(this.baseUrl + 'logout/', body);
  }

  /**
   *
   * @param {number} id - Todo-id
   * @returns An observable that emits the server's response.
   */
  delete(id: number) {
    return this.http.delete(this.baseUrl + `todo/${id}/`);
  }

  addContact(body: any) {
    return this.http.post(this.baseUrl + 'contacts/', body);
  }

  getContacts() {
    return this.http.get(this.baseUrl + 'contacts/');
  }

  updateContact(body: any, id: number) {
    return this.http.put(this.baseUrl + `contacts/${id}/`, body);
  }

  deleteContacts(id: number) {
    return this.http.delete(this.baseUrl + `contacts/${id}/`);
  }

  /**
   *
   * @param req get httprequest
   * @param next clone httprequest and add auth-token
   * @returns return new header with auth-token
   */
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

  /**
   *
   * @param message - string for the user message
   */
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
