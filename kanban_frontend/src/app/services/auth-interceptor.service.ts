import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
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
export class AuthInterceptorService {
  apiService = inject(ApiService);

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     req = req.clone({
  //       setHeaders: {
  //         Authorization: `Token ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //   }
  //   return next.handle(req).pipe(
  //     catchError((err) => {
  //       if (err instanceof HttpErrorResponse) {
  //         if (err.status === 401) {
  //           this.router.navigateByUrl('login');
  //         }
  //       }
  //       return throwError(() => err);
  //     })
  //   );
  // }
}
