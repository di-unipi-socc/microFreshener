import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarUndoComponent } from './subtoolbar-undo.component';

describe('SubtoolbarUndoComponent', () => {
  let component: SubtoolbarUndoComponent;
  let fixture: ComponentFixture<SubtoolbarUndoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarUndoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarUndoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
