import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStudentCategoryComponent } from './add-student-category.component'; 

describe('AddStudentCategoryComponent', () => {
  let component: AddStudentCategoryComponent;
  let fixture: ComponentFixture<AddStudentCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddStudentCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
