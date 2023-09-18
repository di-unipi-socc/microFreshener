import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarItemsArchitectureComponent } from './toolbar-items-architecture.component';

describe('ToolbarItemsArchitectureComponent', () => {
  let component: ToolbarItemsArchitectureComponent;
  let fixture: ComponentFixture<ToolbarItemsArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarItemsArchitectureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarItemsArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
