import { Injectable } from '@angular/core';
import { AddRunTimeLinkCommand, RemoveLinkCommand } from '../link-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { EditorNavigationService } from '../../navigation/navigation.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NodesService } from '../nodes/nodes.service';
import * as joint from 'jointjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker,
    private navigation: EditorNavigationService,
    private nodes: NodesService
  ) { }

  addLink(source, target, timeout?, circuit_breaker?, dynamic_discovery?) {
    console.log("selected, new ->", source, target);
    var command = new AddRunTimeLinkCommand(this.graphService.graph, source.getName(), target.getName(), timeout, circuit_breaker, dynamic_discovery);
    this.graphInvoker.executeCommand(command);
    this.navigation.getPaper().findViewByModel(source).unhighlight();
    this.nodes.showNode(source);
    this.nodes.showNode(target);
    console.log("link added");
  }

  reverseLink(link) {
    let source = link.source();
    let target = link.target();
    link.source(target);
    link.target(source);
  }

  removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    console.log("removing link called");
    this.graphInvoker.executeCommand(new RemoveLinkCommand(this.graphService.graph, link));
  }

  getLinks(): joint.shapes.microtosca.RunTimeLink[] {
    return this.graphService.graph.getLinks();
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
