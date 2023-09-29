import { TestBed } from '@angular/core/testing';

import { EditorPermissionsService } from './editor-permissions.service';

describe('EditorPermissionsService', () => {
  let service: EditorPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
