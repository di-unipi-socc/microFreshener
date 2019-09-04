import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRefineComponent } from './dialog-refine.component';

describe('DialogRefineComponent', () => {
  let component: DialogRefineComponent;
  let fixture: ComponentFixture<DialogRefineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRefineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRefineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
