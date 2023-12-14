import { Injectable } from '@angular/core';

import { g } from 'jointjs';
import { NodesService } from './nodes/nodes.service';
import { InteractionsService } from './interaction-with-links/interactions.service';
import { EdgeService } from './edge/edge.service';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureEditingService {

  constructor(
    private nodes: NodesService,
    private interactions: InteractionsService,
    private edge: EdgeService
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

  isNode(cell: joint.dia.Cell): boolean {
    return this.nodes.isNode(cell);
  }

  isService(node: joint.shapes.microtosca.Node): boolean {
    return this.nodes.isService(node);
  }

  isCommunicationPattern(node: joint.shapes.microtosca.Node): boolean {
    return this.nodes.isCommunicationPattern(node);
  }

  isMessageBroker(node: joint.shapes.microtosca.Node): boolean {
    return this.nodes.isMessageBroker(node);
  }

  isDatastore(node: joint.shapes.microtosca.Node): boolean {
    return this.nodes.isDatastore(node);
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

  getIngoingLinks(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.RunTimeLink[] {
    return this.interactions.getIngoingLinks(node);
  }

  isInteractionLink(cell: joint.dia.Cell) {
    return this.interactions.isInteractionLink(cell);
  }

  // Edge

  isEdgeGroup(node): boolean {
    return this.edge.isEdgeGroup(node);
  }

}