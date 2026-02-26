import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCam } from './web-cam';

describe('WebCam', () => {
  let component: WebCam;
  let fixture: ComponentFixture<WebCam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebCam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebCam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
