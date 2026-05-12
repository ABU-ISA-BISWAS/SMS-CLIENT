import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddGuardianRelationComponent } from './add-guardian-relation.component'; 

describe('AddGuardianRelationComponent', () => {
  let component: AddGuardianRelationComponent;
  let fixture: ComponentFixture<AddGuardianRelationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddGuardianRelationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuardianRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
