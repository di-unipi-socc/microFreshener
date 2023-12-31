import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSmellComponent } from './sidebar-smell.component';

describe('SidebarSmellComponent', () => {
  let component: SidebarSmellComponent;
  let fixture: ComponentFixture<SidebarSmellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarSmellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarSmellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
