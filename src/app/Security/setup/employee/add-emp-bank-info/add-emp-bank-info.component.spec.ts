import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpBankInfoComponent } from './add-emp-bank-info.component';

describe('AddEmpBankInfoComponent', () => {
  let component: AddEmpBankInfoComponent;
  let fixture: ComponentFixture<AddEmpBankInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmpBankInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpBankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
