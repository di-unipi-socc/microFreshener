import { Injectable } from '@angular/core';
import { g } from 'jointjs';
import { Invoker } from 'src/app/commands/invoker';
import { GraphService } from 'src/app/graph/graph.service';
import { AddComputeCommand, RemoveComputeCommand } from './compute-commands';
import { DeployedOnService } from '../deployed-on-links/deployed-on.service';
import { PermissionsService } from 'src/app/permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class ComputeService {

  computesVisible: boolean;

  constructor(
    private graphService: GraphService,
    private graphInvoker: Invoker,
    private permissions: PermissionsService,
    private deploymentLinks: DeployedOnService,
  ) {
    this.computesVisible = false;
  }

  async addCompute(name: string, position?: g.Point) {
    let command = new AddComputeCommand(this.graphService.graph, name, position);
    return this.graphInvoker.executeCommand(command);
  }

  async deleteCompute(compute: joint.shapes.microtosca.Compute) {
      if(this.getDeployedNodes(compute).filter((node) => !this.permissions.writePermissions.isAllowed(node)).length > 0) {
        return Promise.reject("Cannot delete this compute because other team nodes are deployed on it.");
      }
    return this.graphInvoker.executeCommand(new RemoveComputeCommand(this.graphService.graph, compute));
  }

  areComputesVisible() {
    return this.computesVisible;
  }

  showComputes() {
    this.computesVisible = true;
    this.graphService.graph.getComputes().forEach(compute => {
      compute.show();
    });
    this.graphService.graph.getDeploymentLinks().forEach((link: joint.shapes.microtosca.DeploymentTimeLink) => {
      if(this.permissions.writePermissions.isAllowed(link.getSourceElement())) {
        link.show();
      }
    });
  }

  hideComputes() {
    this.computesVisible = false;
    this.graphService.graph.getComputes().forEach(compute => {
      compute.hide();
    });
    this.graphService.graph.getDeploymentLinks().forEach((link: joint.shapes.microtosca.DeploymentTimeLink) => {
      link.hide();
    })
  }

  isCompute(cell): boolean {
    return this.graphService.graph.isCompute(cell);
  }

  getComputes() {
    return this.graphService.graph.getComputes();
  }

  getDeployedNodes(compute: joint.shapes.microtosca.Compute): joint.shapes.microtosca.Node[] {
    return this.deploymentLinks.getDeploymentLinks(compute).map((deployment) => deployment.getSourceElement() as joint.shapes.microtosca.Node);
  }

}
