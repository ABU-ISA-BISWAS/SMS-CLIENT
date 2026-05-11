import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcademicShiftComponent } from './academic-shift.component';

describe('FeaturesComponent', () => {
  let component: AcademicShiftComponent;
  let fixture: ComponentFixture<AcademicShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicShiftComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
