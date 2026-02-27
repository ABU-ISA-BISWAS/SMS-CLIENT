import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BankInfoComponent } from './bank-info.component';

describe('BankInfoComponent', () => {
  let component: BankInfoComponent;
  let fixture: ComponentFixture<BankInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BankInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
