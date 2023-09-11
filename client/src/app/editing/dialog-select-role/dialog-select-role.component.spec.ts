import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectRoleComponent } from './dialog-select-role.component';

describe('DialogSelectRoleComponent', () => {
  let component: DialogSelectRoleComponent;
  let fixture: ComponentFixture<DialogSelectRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelectRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
