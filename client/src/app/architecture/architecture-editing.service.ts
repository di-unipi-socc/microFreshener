import { Injectable } from '@angular/core';

import { g } from 'jointjs';
import { NodesService } from './nodes/nodes.service';
import { InteractionsService } from './interaction-with-links/interactions.service';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureEditingService {

  constructor(
    private nodes: NodesService,
    private interactions: InteractionsService,
  ) { }

  addNode(nodeType: string, name: string, position?: g.Point, communicationPatternType?, team?: joint.shapes.microtosca.SquadGroup) {
    this.nodes.addNode(nodeType, name, position, communicationPatternType, team);
  }

  deleteNode(node) {
    this.nodes.deleteNode(node);
  }

  showNode(node: joint.shapes.microtosca.Node) {
    this.nodes.showNode(node);
  }

  hideNode(node: joint.shapes.microtosca.Node) {
    this.hideNode(node);
  }

  isService(node: joint.shapes.microtosca.Node): boolean {
    return this.nodes.isService(node);
  }

  // Links

  addLink(source, target, timeout?, circuit_breaker?, dynamic_discovery?) {
    this.interactions.addLink(source, target, timeout, circuit_breaker, dynamic_discovery);
  }

  reverseLink(link) {
    this.interactions.reverseLink(link);
  }

  removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    this.interactions.removeLink(link);
  }

}