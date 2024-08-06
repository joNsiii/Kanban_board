import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { AddTodoDialogComponent } from '../dialogs/add-todo-dialog/add-todo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoDetailsComponent } from '../dialogs/todo-details/todo-details.component';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, CommonModule, DragDropModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  api = inject(ApiService);
  dialog = inject(MatDialog);
  router = inject(Router);
  todos = signal([]);
  sortedTodos: any = {
    todo: [],
    in_progress: [],
    testing: [],
    done: [],
  };

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos() {
    this.todos.set([]);
    this.sortedTodos = {
      todo: [],
      in_progress: [],
      testing: [],
      done: [],
    };
    return this.api.getTodos().subscribe((data: any) => {
      this.todos.set(data);
      this.sortTodos();
    });
  }

  logout() {
    this.api.logout({}).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('login');
      },
      error: (err) => {
        console.error(' Somthing went wrong', err);
      },
    });
  }

  sortTodos() {
    this.todos().forEach((todo) => {
      switch (todo['category']) {
        case 'todo':
          this.sortedTodos.todo.push(todo);
          break;
        case 'in_progress':
          this.sortedTodos.in_progress.push(todo);
          break;
        case 'testing':
          this.sortedTodos.testing.push(todo);
          break;
        case 'done':
          this.sortedTodos.done.push(todo);
          break;
      }
    });
    return this.sortedTodos;
  }

  openAddTodoDialog(): void {
    const dialogRef = this.dialog.open(AddTodoDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTodos();
    });
  }

  openTodoDetailDialog(todo: any) {
    const dialogRef = this.dialog.open(TodoDetailsComponent, {
      data: todo,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTodos();
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return '#399254';
      case 'mid':
        return '#bfc566';
      case 'high':
        return '#e38170';
      default:
        return 'green';
    }
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (!event.previousContainer.data || !event.container.data) {
      console.error('Undefined container data:', event);
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const todo = event.container.data[event.currentIndex];
      todo.category = event.container.id;
      this.updateTodo(todo);
    }
  }

  updateTodo(todo: any) {
    this.api.updateTodo(todo, todo.id).subscribe({
      next: () => {},
      error: (err) => {
        this.api.showMessage('somthing went wrong');
        console.error(err);
      },
    });
  }
}
