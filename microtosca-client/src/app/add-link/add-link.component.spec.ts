import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkComponent } from './add-link.component';

describe('AddLinkComponent', () => {
  let component: AddLinkComponent;
  let fixture: ComponentFixture<AddLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
