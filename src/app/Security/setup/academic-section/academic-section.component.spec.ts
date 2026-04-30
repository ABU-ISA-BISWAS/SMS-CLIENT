import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcademicSectionComponent } from './academic-section.component';

describe('FeaturesComponent', () => {
  let component: AcademicSectionComponent;
  let fixture: ComponentFixture<AcademicSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
