import { Injectable } from '@angular/core';
import { AddDeploymentLinkCommand, RemoveDeploymentLinkCommand } from './deployed-on-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { GraphInvoker } from 'src/app/commands/invoker';

@Injectable({
  providedIn: 'root'
})
export class DeployedOnService {

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker
  ) { }

  async addDeploymentLink(source, target) {
    let command = new AddDeploymentLinkCommand(this.graphService.graph, source.getName(), target.getName());
    return this.graphInvoker.executeCommand(command);
  }

  async removeDeploymentLink(link: joint.shapes.microtosca.DeploymentTimeLink) {
    return this.graphInvoker.executeCommand(new RemoveDeploymentLinkCommand(this.graphService.graph, link));
  }
}
