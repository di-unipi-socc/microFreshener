import { TestBed } from '@angular/core/testing';

import { TeamsAnalyticsService } from './teams-analytics.service';

describe('TeamsAnalyticsService', () => {
  let service: TeamsAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
