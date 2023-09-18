import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsGraphNavigationComponent } from './toolbar-items-graph-navigation.component';

describe('ToolbarItemsGraphNavigationComponent', () => {
  let component: ToolbarItemsGraphNavigationComponent;
  let fixture: ComponentFixture<ToolbarItemsGraphNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsGraphNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsGraphNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
