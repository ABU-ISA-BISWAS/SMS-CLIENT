import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuardianRelationComponent } from './guardian-relation.component'; 

describe('FeaturesComponent', () => {
  let component: GuardianRelationComponent;
  let fixture: ComponentFixture<GuardianRelationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GuardianRelationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardianRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
