import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarInsideTeamViewComponent } from './subtoolbar-inside-team-view.component';

describe('SubtoolbarInsideTeamViewComponent', () => {
  let component: SubtoolbarInsideTeamViewComponent;
  let fixture: ComponentFixture<SubtoolbarInsideTeamViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarInsideTeamViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarInsideTeamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
