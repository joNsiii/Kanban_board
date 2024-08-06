import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  router = inject(Router);
  hide = signal(true);
  apiService = inject(ApiService);
  errorMessage = signal('');
  registerForm = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.matchingPasswords('password', 'confirmPassword') }
  );

  submit() {
    if (this.registerForm.valid) {
      this.register();
    }
  }

  register() {
    return this.apiService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('login');
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        console.error(err);
      },
    });
  }

  showData() {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  matchingPasswords(
    passwordKey: string,
    confirmPasswordKey: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(passwordKey);
      const confirmPasswordControl = formGroup.get(confirmPasswordKey);

      if (!passwordControl || !confirmPasswordControl) {
        return null; // Return null if controls are not found
      }
      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null; // Return early if another validator has already found an error on the confirmPassword control
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null); // Clear the error if passwords match
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.register().unsubscribe();
  }
}
