import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModuleRoleComponent } from './sub-module-role.component';

describe('SubModuleRoleComponent', () => {
  let component: SubModuleRoleComponent;
  let fixture: ComponentFixture<SubModuleRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubModuleRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubModuleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
