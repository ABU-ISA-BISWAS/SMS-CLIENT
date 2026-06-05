import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSystemConfigComponent } from './add-system-config.component';
describe('AddSystemConfigComponent', () => {
  let component: AddSystemConfigComponent;
  let fixture: ComponentFixture<AddSystemConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSystemConfigComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSystemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
