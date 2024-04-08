import { TestBed } from '@angular/core/testing';

import { TeamEditingService } from './team-editing.service';

describe('TeamEditingService', () => {
  let service: TeamEditingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamEditingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
