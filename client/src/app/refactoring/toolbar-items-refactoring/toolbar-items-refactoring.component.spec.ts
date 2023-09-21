import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsRefactoringComponent } from './toolbar-items-refactoring.component';

describe('ToolbarItemsRefactoringComponent', () => {
  let component: ToolbarItemsRefactoringComponent;
  let fixture: ComponentFixture<ToolbarItemsRefactoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsRefactoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsRefactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
