import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddSalaryGradeComponent } from './add-salary-grade.component';

describe('AddSalaryGradeComponent', () => {
  let component: AddSalaryGradeComponent;
  let fixture: ComponentFixture<AddSalaryGradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalaryGradeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalaryGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
