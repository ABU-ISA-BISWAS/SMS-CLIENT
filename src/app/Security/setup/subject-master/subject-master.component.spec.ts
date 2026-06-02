import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectMasterComponent } from './subject-master.component';

describe('FeaturesComponent', () => {
  let component: SubjectMasterComponent;
  let fixture: ComponentFixture<SubjectMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectMasterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
