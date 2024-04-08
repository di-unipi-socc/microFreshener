import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtoolbarNavigationComponent } from './subtoolbar-navigation.component';

describe('SubtoolbarNavigationComponent', () => {
  let component: SubtoolbarNavigationComponent;
  let fixture: ComponentFixture<SubtoolbarNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtoolbarNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtoolbarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
