import { TestBed } from '@angular/core/testing';

import { EditorNavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: EditorNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
