import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupVersionComponent } from './group-version.component';

describe('FeaturesComponent', () => {
  let component: GroupVersionComponent;
  let fixture: ComponentFixture<GroupVersionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GroupVersionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
