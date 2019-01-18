import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNodeComponent } from './graph-node.component';

describe('GraphNodeComponent', () => {
  let component: GraphNodeComponent;
  let fixture: ComponentFixture<GraphNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
