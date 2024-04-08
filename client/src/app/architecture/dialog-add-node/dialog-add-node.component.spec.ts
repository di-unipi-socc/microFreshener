import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddNodeComponent } from './dialog-add-node.component';

describe('DialogAddNodeComponent', () => {
  let component: DialogAddNodeComponent;
  let fixture: ComponentFixture<DialogAddNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
