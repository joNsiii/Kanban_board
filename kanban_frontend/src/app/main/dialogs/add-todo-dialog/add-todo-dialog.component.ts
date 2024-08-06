import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-todo-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-todo-dialog.component.html',
  styleUrl: './add-todo-dialog.component.scss',
})
export class AddTodoDialogComponent implements OnInit, OnDestroy {
  api = inject(ApiService);
  dialogRef = inject(MatDialogRef<AddTodoDialogComponent>);
  users: any[] = [];
  createTodoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    assigned_users: new FormControl([]),
    description: new FormControl(''),
    priority: new FormControl('', Validators.required),
  });
  errorMessage: ValidationErrors | null = null;

  /**
   * get user list
   */
  ngOnInit(): void {
    this.getUserList();
  }

  /**
   * unsubscribe to user list
   */
  ngOnDestroy(): void {
    this.getUserList().unsubscribe();
  }

  /**
   *
   * @returns the user list
   */
  getUserList() {
    return this.api.getUserList().subscribe((user: any) => {
      this.users = user;
    });
  }

  /**
   * if form is valid, we sent the object to backend and recive a statuscode
   * show message for the user
   */
  submit() {
    if (this.createTodoForm.valid) {
      this.api.postTodos(this.createTodoForm.value).subscribe({
        next: () => {
          this.api.showMessage('Post created');
          this.close();
        },
        error: (err) => {
          this.api.showMessage('Somthing went wrong');
          console.error(err);
        },
      });
    } else {
      this.errorMessage = this.createTodoForm.errors;
    }
  }

  /**
   * close dialog
   */
  close() {
    this.dialogRef.close();
  }
}
