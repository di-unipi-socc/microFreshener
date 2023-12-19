import { Injectable } from '@angular/core';

import { g } from 'jointjs';
import { NodesService } from './nodes/nodes.service';
import { InteractionsService } from './interacts-with-links/interactions.service';
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

  async addNode(nodeType: string, name: string, position?: g.Point, communicationPatternType?, team?: joint.shapes.microtosca.SquadGroup) {
    return this.nodes.addNode(nodeType, name, position, communicationPatternType, team);
  }

  async deleteNode(node) {
    return this.nodes.deleteNode(node);
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

  async addLink(source, target, timeout?, circuit_breaker?, dynamic_discovery?) {
    return this.interactions.addLink(source, target, timeout, circuit_breaker, dynamic_discovery);
  }

  async reverseLink(link) {
    return this.interactions.reverseLink(link);
  }

  async removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    return this.interactions.removeLink(link);
  }

  getLinks(): joint.shapes.microtosca.RunTimeLink[] {
    return this.interactions.getLinks();
  }

  getIngoingLinks(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.RunTimeLink[] {
    return this.interactions.getIngoingLinks(node);
  }

  isInteractionLink(cell: joint.dia.Cell) {
    return this.interactions.isInteractionLink(cell);
  }

  createAddingLink(sourceNodeId, position) {
    return this.interactions.createAddingLink(sourceNodeId, position);
  }

  // Edge

  isEdgeGroup(node): boolean {
    return this.edge.isEdgeGroup(node);
  }

}