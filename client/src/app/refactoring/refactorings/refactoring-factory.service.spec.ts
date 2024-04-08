import { TestBed } from '@angular/core/testing';

import { RefactoringFactoryService } from './refactoring-factory.service';

describe('RefactoringFactoryService', () => {
  let service: RefactoringFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefactoringFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
