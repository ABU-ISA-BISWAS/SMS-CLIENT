import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionComponent } from './admission.component'; 

describe('SetupComponent', () => {
  let component: AdmissionComponent;
  let fixture: ComponentFixture<AdmissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
