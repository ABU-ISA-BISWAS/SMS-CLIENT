import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddSmsTemplateComponent } from './add-sms-template.component';

describe('AddSmsTemplateComponent', () => {
  let component: AddSmsTemplateComponent;
  let fixture: ComponentFixture<AddSmsTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSmsTemplateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
