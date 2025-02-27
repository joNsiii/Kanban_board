import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  router = inject(Router);
  hide = signal(true);
  apiService = inject(ApiService);
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  errorMessage = signal('');

  showData() {
    console.log(this.errorMessage());
  }

  /**
   * submit the login
   */
  submit() {
    this.login();
  }

  /**
   *
   * Send login creditials
   * after success - set token in localstorage.
   *
   * @returns An observable that emits the server's response.
   */
  login() {
    return this.apiService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res['token']);
        this.router.navigateByUrl('home');
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage.set('Username oder Password falsch!');
      },
    });
  }

  /**
   *
   * show or hide passwordstring
   *
   * @param event - Mouseclick
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  /**
   * navigate to register-site
   */
  goToRegister() {
    this.router.navigateByUrl('register');
  }

  /**
   * unsubscribe login
   */
  ngOnDestroy(): void {
    this.login().unsubscribe();
  }
}
