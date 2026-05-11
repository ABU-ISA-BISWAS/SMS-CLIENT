import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGroupVersionComponent } from './add-group-version.component';

describe('AddGroupVersionComponent', () => {
  let component: AddGroupVersionComponent;
  let fixture: ComponentFixture<AddGroupVersionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddGroupVersionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
