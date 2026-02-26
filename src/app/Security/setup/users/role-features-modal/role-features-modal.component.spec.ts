import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFeaturesModalComponent } from './role-features-modal.component';

describe('RoleFeaturesModalComponent', () => {
  let component: RoleFeaturesModalComponent;
  let fixture: ComponentFixture<RoleFeaturesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFeaturesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFeaturesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
