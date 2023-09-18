import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsUndoComponent } from './toolbar-items-undo.component';

describe('ToolbarItemsUndoComponent', () => {
  let component: ToolbarItemsUndoComponent;
  let fixture: ComponentFixture<ToolbarItemsUndoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsUndoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsUndoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
