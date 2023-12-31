import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddComputeComponent } from './dialog-add-compute.component';

describe('DialogAddComputeComponent', () => {
  let component: DialogAddComputeComponent;
  let fixture: ComponentFixture<DialogAddComputeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddComputeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddComputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
