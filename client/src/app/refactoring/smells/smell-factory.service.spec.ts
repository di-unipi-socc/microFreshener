import { TestBed } from '@angular/core/testing';

import { SmellFactoryService } from './smell-factory.service';

describe('SmellFactoryService', () => {
  let service: SmellFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmellFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
