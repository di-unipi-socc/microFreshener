import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarFromTeamNavigationComponent } from './subtoolbar-from-team-navigation.component';

describe('SubtoolbarInsideTeamViewComponent', () => {
  let component: SubtoolbarFromTeamNavigationComponent;
  let fixture: ComponentFixture<SubtoolbarFromTeamNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarFromTeamNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarFromTeamNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
