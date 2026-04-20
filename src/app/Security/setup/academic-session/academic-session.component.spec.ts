import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcademicSessionComponent } from './academic-session.component';

describe('FeaturesComponent', () => {
  let component: AcademicSessionComponent;
  let fixture: ComponentFixture<AcademicSessionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicSessionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
