import { TestBed } from '@angular/core/testing';

import { GraphEditingService } from './graph-editing.service';

describe('GraphEditingService', () => {
  let service: GraphEditingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphEditingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
