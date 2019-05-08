import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSmellComponent } from './dialog-smell.component';

describe('DialogSmellComponent', () => {
  let component: DialogSmellComponent;
  let fixture: ComponentFixture<DialogSmellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSmellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSmellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
