import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcademicClassComponent } from './academic-class.component';

describe('FeaturesComponent', () => {
  let component: AcademicClassComponent;
  let fixture: ComponentFixture<AcademicClassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicClassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
