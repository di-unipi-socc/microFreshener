import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveLinkComponent } from './remove-link.component';

describe('RemoveLinkComponent', () => {
  let component: RemoveLinkComponent;
  let fixture: ComponentFixture<RemoveLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
