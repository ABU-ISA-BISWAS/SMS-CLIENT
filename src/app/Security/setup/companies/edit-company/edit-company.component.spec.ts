import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditCompanyComponent } from './edit-company.component';

describe('EditCompanyComponent', () => {
  let component: EditCompanyComponent;
  let fixture: ComponentFixture<EditCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditCompanyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
