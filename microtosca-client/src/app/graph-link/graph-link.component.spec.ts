import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLinkComponent } from './graph-link.component';

describe('GraphLinkComponent', () => {
  let component: GraphLinkComponent;
  let fixture: ComponentFixture<GraphLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
