import { Component } from '@angular/core';
import { DeploymentService } from '../deployment.service';

@Component({
  selector: 'app-subtoolbar-compute',
  templateUrl: './subtoolbar-compute.component.html',
  styleUrls: ['./subtoolbar-compute.component.css']
})
export class SubtoolbarComputeComponent {

  computeToggledState: boolean;

  constructor(
    private deployment: DeploymentService
  ) {
    this.computeToggledState = false;
  }

  toggleCompute() {
    if(this.computeToggledState) {
      this.deployment.showComputes();
    } else {
      this.deployment.hideComputes();
    }
  }

  isToggled() {
    return this.computeToggledState;
  }

}
