import { TestBed } from '@angular/core/testing';

import { ToolSelectionService } from './tool-selection.service';

describe('ToolSelectionService', () => {
  let service: ToolSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
