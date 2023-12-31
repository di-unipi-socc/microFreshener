import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeployOnComponent } from './dialog-deploy-on.component';

describe('DialogDeployOnComponent', () => {
  let component: DialogDeployOnComponent;
  let fixture: ComponentFixture<DialogDeployOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeployOnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeployOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
