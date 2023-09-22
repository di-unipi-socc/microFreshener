import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRefactoringsComponent } from './modal-refactorings.component';

describe('ModalRefactoringsComponent', () => {
  let component: ModalRefactoringsComponent;
  let fixture: ComponentFixture<ModalRefactoringsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRefactoringsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRefactoringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
