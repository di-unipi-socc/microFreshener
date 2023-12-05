import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTeamsRelationsComponent } from './sidebar-teams-relations.component';

describe('SidebarTeamsRelationsComponent', () => {
  let component: SidebarTeamsRelationsComponent;
  let fixture: ComponentFixture<SidebarTeamsRelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarTeamsRelationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTeamsRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
