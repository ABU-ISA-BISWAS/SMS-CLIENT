import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleNewComponent } from './add-role-new.component';

describe('AddRoleNewComponent', () => {
  let component: AddRoleNewComponent;
  let fixture: ComponentFixture<AddRoleNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
