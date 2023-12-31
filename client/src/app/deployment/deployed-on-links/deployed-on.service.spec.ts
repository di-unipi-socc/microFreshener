import { TestBed } from '@angular/core/testing';

import { DeployedOnService } from './deployed-on.service';

describe('DeployedOnService', () => {
  let service: DeployedOnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeployedOnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
