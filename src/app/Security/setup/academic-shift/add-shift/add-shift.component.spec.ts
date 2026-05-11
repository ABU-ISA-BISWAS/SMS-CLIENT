import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddShiftComponent } from './add-shift.component';

describe('AddShiftComponent', () => {
  let component: AddShiftComponent;
  let fixture: ComponentFixture<AddShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddShiftComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
