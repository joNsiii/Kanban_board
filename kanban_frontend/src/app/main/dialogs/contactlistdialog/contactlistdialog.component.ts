import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormControlName,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contactlistdialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './contactlistdialog.component.html',
  styleUrl: './contactlistdialog.component.scss',
})
export class ContactlistdialogComponent implements OnInit, OnDestroy {
  apiService = inject(ApiService);
  dialogRef = inject(MatDialogRef<ContactlistdialogComponent>);
  userList: any[] = [];
  contactsList: any[] = [];
  filteredUserList: any[] = [];
  userName: string = '';
  email: string = '';
  phone: string = '';
  editingId: number | null = null;

  ngOnInit(): void {
    this.getUser();
    this.getContacts();
  }

  ngOnDestroy(): void {
    this.getUser().unsubscribe();
    this.getContacts().unsubscribe();
  }

  getUser() {
    return this.apiService.getUserList().subscribe({
      next: (data: any) => {
        this.userList = data;
        console.log(this.userList);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getContacts() {
    return this.apiService.getContacts().subscribe({
      next: (data: any) => {
        this.contactsList = data;
        this.filterUserList();
      },
    });
  }

  submitDelete(contact: any) {
    this.apiService.deleteContacts(contact.id).subscribe({
      next: () => {
        this.apiService.showMessage(
          'Contact deleted ' + contact.contact_username
        );
        setTimeout(() => {
          this.getContacts();
          this.getContacts().unsubscribe();
        }, 1000);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showUpdateInputs(id: number) {
    this.editingId = id;
  }

  cancelEdit() {
    this.editingId = null;
  }

  update(body: any) {
    this.apiService.updateContact(body, body.id).subscribe({
      next: () => {
        this.apiService.showMessage('Contact updated ' + body.contact_username);
        this.editingId = null;
      },
    });
  }

  filterUserList() {
    const contactUsernames = this.contactsList.map(
      (contact) => contact.contact_username
    );
    this.filteredUserList = this.userList.filter(
      (user) => !contactUsernames.includes(user.username)
    );
  }

  addUserToContactList() {
    const user = {
      contact_username: this.userName,
    };
    this.apiService.addContact(user).subscribe({
      next: () => {
        this.apiService.showMessage('User added');
      },
      error: (err) => {
        console.error(err);
      },
    });
    setTimeout(() => {
      this.getContacts();
      this.getContacts().unsubscribe();
    }, 1000);
    this.userName = '';
    this.filterUserList();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
