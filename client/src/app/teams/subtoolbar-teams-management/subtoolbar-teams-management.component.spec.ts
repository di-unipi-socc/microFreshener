import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarTeamsComponent } from './subtoolbar-teams-management.component';

describe('SubtoolbarTeamsComponent', () => {
  let component: SubtoolbarTeamsComponent;
  let fixture: ComponentFixture<SubtoolbarTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
