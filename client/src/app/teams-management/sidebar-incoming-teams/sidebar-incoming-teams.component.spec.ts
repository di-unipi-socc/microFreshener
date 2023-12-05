import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarIncomingTeamsComponent } from './sidebar-incoming-teams.component';

describe('SidebarIncomingTeamsComponent', () => {
  let component: SidebarIncomingTeamsComponent;
  let fixture: ComponentFixture<SidebarIncomingTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarIncomingTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarIncomingTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
