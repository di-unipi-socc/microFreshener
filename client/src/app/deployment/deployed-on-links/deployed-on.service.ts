import { Injectable } from '@angular/core';
import { AddDeploymentLinkCommand, RemoveDeploymentLinkCommand } from './deployed-on-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import { PermissionsService } from 'src/app/permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class DeployedOnService {

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker,
    private permissionsService: PermissionsService
  ) { }

  async addDeploymentLink(source, target) {
    let command = new AddDeploymentLinkCommand(this.graphService.graph, source.getName(), target.getName());
    return this.graphInvoker.executeCommand(command);
  }

  async removeDeploymentLink(deploymentLink: joint.shapes.microtosca.DeploymentTimeLink) {
    if(!this.permissionsService.writePermissions.isAllowed(deploymentLink.getSourceElement())) {
      return Promise.reject("You cannot delete other teams' deployment links.");
    }
    return this.graphInvoker.executeCommand(new RemoveDeploymentLinkCommand(this.graphService.graph, deploymentLink));
  }

  isDeploymentLink(link: joint.shapes.microtosca.DeploymentTimeLink): boolean {
    return this.graphService.graph.isDeploymentLink(link);
  }

  getDeploymentLinks(compute: joint.shapes.microtosca.Compute) {
    return this.graphService.graph.getComputeDeploymentLinks(compute);
  }
}
