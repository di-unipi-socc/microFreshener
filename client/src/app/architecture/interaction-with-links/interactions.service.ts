import { Injectable } from '@angular/core';
import { AddRunTimeLinkCommand, RemoveLinkCommand } from '../link-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { EditorNavigationService } from 'src/app/editor/navigation/navigation.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NodesService } from '../nodes/nodes.service';

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

}
