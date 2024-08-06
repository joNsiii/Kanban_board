import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  router = inject(Router);
  apiService = inject(ApiService);

  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('login');
      return false;
    }
    return true;
  }
}
