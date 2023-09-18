import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsViewComponent } from './toolbar-items-view.component';

describe('ToolbarItemsViewComponent', () => {
  let component: ToolbarItemsViewComponent;
  let fixture: ComponentFixture<ToolbarItemsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
