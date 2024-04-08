import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnalysisComponent } from './dialog-analysis.component';

describe('DialogAnalysisComponent', () => {
  let component: DialogAnalysisComponent;
  let fixture: ComponentFixture<DialogAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
