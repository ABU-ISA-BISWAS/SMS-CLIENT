import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdmissionDrawerComponent } from './admission-drawer.component';

describe('AdmissionDrawerComponent', () => {
  let component: AdmissionDrawerComponent;
  let fixture: ComponentFixture<AdmissionDrawerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdmissionDrawerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
});