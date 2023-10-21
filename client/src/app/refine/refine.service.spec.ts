import { TestBed } from '@angular/core/testing';

import { RefineService } from './refine.service';

describe('RefineService', () => {
  let service: RefineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
