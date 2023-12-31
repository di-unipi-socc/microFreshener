import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarComputeComponent } from './subtoolbar-compute.component';

describe('SubtoolbarComputeComponent', () => {
  let component: SubtoolbarComputeComponent;
  let fixture: ComponentFixture<SubtoolbarComputeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarComputeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarComputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
