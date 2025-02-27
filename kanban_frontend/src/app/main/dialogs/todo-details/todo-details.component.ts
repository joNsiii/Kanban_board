import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './todo-details.component.html',
  styleUrl: './todo-details.component.scss',
})
export class TodoDetailsComponent implements OnInit, OnDestroy {
  dialogRef = inject(MatDialogRef<TodoDetailsComponent>);
  api = inject(ApiService);
  todo = inject(MAT_DIALOG_DATA);
  users: any = '';
  editable: boolean = false;
  btn: boolean = false;

  newForm = {
    title: this.todo.title,
    description: this.todo.description,
    assigned_users: this.todo.assigned_users,
    priority: this.todo.priority,
  };

  /**
   * get user list
   */
  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * get user list
   */
  getUsers() {
    return this.api.getUserList().subscribe((data) => {
      this.users = data;
    });
  }

  /**
   * unsubscribe user-list
   */
  ngOnDestroy(): void {
    this.getUsers().unsubscribe();
    // this.deleteTodo().unsubscribe();
  }

  /**
   * deletetodo button
   */
  submitDelete() {
    this.deleteTodo();
  }

  /**
   *
   * @returns a response after deleting todo
   */
  deleteTodo() {
    return this.api.delete(this.todo.id).subscribe({
      next: () => {
        this.api.showMessage('Todo deleted');
        this.dialogRef.close();
      },
      error: (err) => {
        this.api.showMessage('Something went wrong');
        console.error(err);
      },
    });
  }

  /**
   * hide or show input´s for updating todo
   */
  showInputs() {
    this.editable = !this.editable;
  }

  /**
   * set new value for each field after update
   * save the updated object in backend
   */
  update() {
    this.btn = true;
    this.todo.title = this.newForm.title;
    this.todo.description = this.newForm.description;
    this.todo.assigned_users = this.newForm.assigned_users;
    this.todo.priority = this.newForm.priority;
    this.saveUpdate();
  }

  /**
   * save object in backend and show a message for the user
   */
  saveUpdate() {
    this.api.updateTodo(this.todo, this.todo.id).subscribe({
      next: () => {
        this.showInputs();
        this.btn = false;
        this.api.showMessage('Successfully updated');
      },
      error: (err) => {
        this.btn = false;
        this.api.showMessage('Something went wrong');
        console.error(err);
      },
    });
  }

  /**
   *
   * @returns background-color for todocard
   */
  getPriorityColor() {
    switch (this.todo.priority) {
      case 'low':
        return '#399254';
      case 'mid':
        return '#bfc566';
      case 'high':
        return '#e38170';
    }
    return 'transparent';
  }
}
