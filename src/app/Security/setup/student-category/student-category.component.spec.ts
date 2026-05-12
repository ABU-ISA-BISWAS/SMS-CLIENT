import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentCategoryComponent } from './student-category.component'; 

describe('FeaturesComponent', () => {
  let component: StudentCategoryComponent;
  let fixture: ComponentFixture<StudentCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCategoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
