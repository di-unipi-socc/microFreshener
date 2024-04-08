import { TestBed } from '@angular/core/testing';

import { ArchitectureEditingService } from './architecture-editing.service';

describe('GraphEditingService', () => {
  let service: ArchitectureEditingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchitectureEditingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
