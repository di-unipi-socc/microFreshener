import { TestBed } from '@angular/core/testing';

import { AnalyserService } from './analyser.service';

describe('AnalyserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyserService = TestBed.get(AnalyserService);
    expect(service).toBeTruthy();
  });
});
