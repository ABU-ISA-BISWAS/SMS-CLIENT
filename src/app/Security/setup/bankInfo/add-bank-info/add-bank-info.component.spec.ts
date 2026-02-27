import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddBankInfoComponent } from './add-bank-info.component';

describe('AddBankInfoComponent', () => {
  let component: AddBankInfoComponent;
  let fixture: ComponentFixture<AddBankInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddBankInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
