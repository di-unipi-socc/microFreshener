import { TestBed } from '@angular/core/testing';

import { ComputeService } from './compute.service';

describe('ComputeService', () => {
  let service: ComputeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
