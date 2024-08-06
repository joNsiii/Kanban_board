import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  router = inject(Router);
  apiService = inject(ApiService);

  /**
   * checking required token
   *
   * @returns {boolean} - false if token is missing and true if user is logged in
   */
  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
      return false;
    }
    return true;
  }
}
