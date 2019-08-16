import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectTeamComponent } from './dialog-select-team.component';

describe('DialogSelectTeamComponent', () => {
  let component: DialogSelectTeamComponent;
  let fixture: ComponentFixture<DialogSelectTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelectTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
