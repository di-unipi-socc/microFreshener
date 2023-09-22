import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarRefactoringComponent } from './subtoolbar-refactoring.component';

describe('SubtoolbarRefactoringComponent', () => {
  let component: SubtoolbarRefactoringComponent;
  let fixture: ComponentFixture<SubtoolbarRefactoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarRefactoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarRefactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
