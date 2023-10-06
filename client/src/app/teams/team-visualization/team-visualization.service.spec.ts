import { TestBed } from '@angular/core/testing';

import { TeamVisualizationService } from './team-visualization.service';

describe('TeamVisualizationService', () => {
  let service: TeamVisualizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamVisualizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
