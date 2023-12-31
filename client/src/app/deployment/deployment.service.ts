import { Injectable } from '@angular/core';
import { ComputeService } from './computes/compute.service';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {

  constructor(
    private computes: ComputeService
  ) {}

  // Compute

  async addCompute(name: string) {
    return this.computes.addCompute(name);
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

  // DeployedOn


}
