import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsTeamsComponent } from './toolbar-items-teams.component';

describe('ToolbarItemsTeamsComponent', () => {
  let component: ToolbarItemsTeamsComponent;
  let fixture: ComponentFixture<ToolbarItemsTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
