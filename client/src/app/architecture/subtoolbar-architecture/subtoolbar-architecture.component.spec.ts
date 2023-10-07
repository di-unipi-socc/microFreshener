import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarArchitectureComponent } from './subtoolbar-architecture.component';

describe('SubtoolbarArchitectureComponent', () => {
  let component: SubtoolbarArchitectureComponent;
  let fixture: ComponentFixture<SubtoolbarArchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarArchitectureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarArchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
