import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddClassSubjectMappingComponent } from './add-class-subject-mapping.component';

describe('AddClassSubjectMappingComponent', () => {
  let component: AddClassSubjectMappingComponent;
  let fixture: ComponentFixture<AddClassSubjectMappingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddClassSubjectMappingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassSubjectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
