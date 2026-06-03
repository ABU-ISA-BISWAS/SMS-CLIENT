import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClassSubjectMappingComponent } from './class-subject-mapping.component';

describe('ClassSubjectMappingComponent', () => {
  let component: ClassSubjectMappingComponent;
  let fixture: ComponentFixture<ClassSubjectMappingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClassSubjectMappingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
