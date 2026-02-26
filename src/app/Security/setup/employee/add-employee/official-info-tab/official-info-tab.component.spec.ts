import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialInfoTabComponent } from './official-info-tab.component';

describe('OfficialInfoTabComponent', () => {
  let component: OfficialInfoTabComponent;
  let fixture: ComponentFixture<OfficialInfoTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialInfoTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
