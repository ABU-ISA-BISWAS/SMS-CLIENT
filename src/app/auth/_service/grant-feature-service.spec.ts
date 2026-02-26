import { TestBed } from '@angular/core/testing';

import { GrantFeatureService } from './grant-feature-service';

describe('GrantFeatureService', () => {
  let service: GrantFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrantFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
