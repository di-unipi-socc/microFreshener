import { TestBed } from '@angular/core/testing';

import { TeamsManagementService } from './teams.service';

describe('TeamsManagementService', () => {
  let service: TeamsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
