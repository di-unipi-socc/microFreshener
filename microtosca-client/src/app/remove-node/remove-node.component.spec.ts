import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveNodeComponent } from './remove-node.component';

describe('RemoveNodeComponent', () => {
  let component: RemoveNodeComponent;
  let fixture: ComponentFixture<RemoveNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
