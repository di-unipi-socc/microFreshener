import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTeamDetailsComponent } from './sidebar-team-details.component';

describe('SidebarTeamDetailsComponent', () => {
  let component: SidebarTeamDetailsComponent;
  let fixture: ComponentFixture<SidebarTeamDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarTeamDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
