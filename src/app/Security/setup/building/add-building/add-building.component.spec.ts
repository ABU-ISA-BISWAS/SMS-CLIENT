import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddBuildingComponent } from './add-building.component';

describe('AddBuildingComponent', () => {
  let component: AddBuildingComponent;
  let fixture: ComponentFixture<AddBuildingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddBuildingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
