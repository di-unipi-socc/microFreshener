import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarViewComponent } from './subtoolbar-view.component';

describe('SibtppòbarViewComponent', () => {
  let component: SubtoolbarViewComponent;
  let fixture: ComponentFixture<SubtoolbarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
