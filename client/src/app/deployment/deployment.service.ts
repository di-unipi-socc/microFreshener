import { Injectable } from '@angular/core';
import { ComputeService } from './computes/compute.service';
import { DeployedOnService } from './deployed-on-links/deployed-on.service';
import { g } from 'jointjs';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {

  constructor(
    private computes: ComputeService,
    private links: DeployedOnService
  ) {}

  // Compute

  async addCompute(name: string, position?: g.Point) {
    return this.computes.addCompute(name, position);
  }

  async deleteNode(node) {
    return this.computes.deleteNode(node);
  }

  showComputes() {
    this.computes.showComputes();
  }

  hideComputes() {
    this.computes.hideComputes();
  }

  areComputesVisible() {
    return this.computes.areComputesVisible();
  }

  isCompute(cell) {
    return this.computes.isCompute(cell);
  }

  // DeployedOn

  addDeploymentLink(source, target) {
    return this.links.addDeploymentLink(source, target);
  }

  removeDeploymentLink(link) {
    return this.links.removeDeploymentLink(link);
  }

}
