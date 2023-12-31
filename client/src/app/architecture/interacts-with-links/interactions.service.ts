import { Injectable } from '@angular/core';
import { AddRunTimeLinkCommand, RemoveLinkCommand } from './interaction-with-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import * as joint from 'jointjs';
import { PermissionsService } from 'src/app/permissions/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker,
    private permissions: PermissionsService,
  ) { }

  async addLink(source, target, timeout?, circuit_breaker?, dynamic_discovery?) {
    console.log("selected, new ->", source, target);
    if(this.graphService.graph.isCompute(target)) {
      return Promise.reject("You cannot add an interaction to a compute node.");
    }
    if(!this.permissions.writePermissions.isAllowed(source)) {
      return Promise.reject("You are not allowed to add an interaction from the selected node.");
    }
    let command = new AddRunTimeLinkCommand(this.graphService.graph, source.getName(), target.getName(), timeout, circuit_breaker, dynamic_discovery);
    return this.graphInvoker.executeCommand(command);
  }

  async reverseLink(link) {
    let source = link.source();
    let target = link.target();
    if(!this.permissions.writePermissions.isAllowed(source) || !this.permissions.writePermissions.isAllowed(target)) {
      return Promise.reject("You are not allowed to change this interaction.");
    }
    link.source(target);
    link.target(source);
    Promise.resolve();
  }

  async removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    if(!this.permissions.writePermissions.isAllowed(link.getSourceElement())) {
      return Promise.reject("You are not allowed to add an interaction from the selected node.");
    }
    return this.graphInvoker.executeCommand(new RemoveLinkCommand(this.graphService.graph, link));
  }

  getLinks(): joint.shapes.microtosca.RunTimeLink[] {
    return this.graphService.graph.getRuntimeLinks();
  }

  getIngoingLinks(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.RunTimeLink[] {
    return this.graphService.graph.getIngoingLinks(node);
  }

  isInteractionLink(cell: joint.dia.Cell) {
    return this.graphService.graph.isInteractionLink(cell);
  }

  createAddingLink(sourceNodeId, position) {
    let addingLink = new joint.shapes.microtosca.RunTimeLink({
      source: { id: sourceNodeId },
      target: { x: position.x, y: position.y }
    });
    addingLink.attr('path/pointer-events', 'none');
    addingLink.addTo(this.graphService.graph);
    return addingLink;
  }

}
