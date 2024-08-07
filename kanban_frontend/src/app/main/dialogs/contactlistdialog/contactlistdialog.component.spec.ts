import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlistdialogComponent } from './contactlistdialog.component';

describe('ContactlistdialogComponent', () => {
  let component: ContactlistdialogComponent;
  let fixture: ComponentFixture<ContactlistdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactlistdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactlistdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
