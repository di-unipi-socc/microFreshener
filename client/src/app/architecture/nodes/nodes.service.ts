import { Injectable } from '@angular/core';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand, AddServiceCommand, RemoveNodeCommand } from '../node-commands';
import { g } from 'jointjs';
import { AddMemberToTeamGroupCommand } from 'src/app/teams/team-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { MessageService } from 'primeng/api';
import { GraphInvoker } from 'src/app/commands/invoker';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  constructor(
    private graphInvoker: GraphInvoker,
    private graphService: GraphService,
    private messageService: MessageService,
  ) { }

  addNode(nodeType: string, name: string, position?: g.Point, communicationPatternType?, team?: joint.shapes.microtosca.SquadGroup) {
    let addNodeCommand;
    let message: string;
    switch (nodeType) {
      case ToolSelectionService.SERVICE:
        addNodeCommand = new AddServiceCommand(this.graphService.graph, name, position);
        message = `Service ${name} added correctly`;
        break;
      case ToolSelectionService.DATASTORE:
        addNodeCommand = new AddDatastoreCommand(this.graphService.graph, name, position);
        message = `Datastore  ${name}  added correctly`;
        break;
      case ToolSelectionService.COMMUNICATION_PATTERN:
        if(communicationPatternType === ToolSelectionService.MESSAGE_BROKER){
          addNodeCommand = new AddMessageBrokerCommand(this.graphService.graph, name, position);
          message += `Message Broker ${name} added correctly`;
        }
        else if(communicationPatternType === ToolSelectionService.MESSAGE_ROUTER){
          addNodeCommand = new AddMessageRouterCommand(this.graphService.graph, name, position);
          message += `Message Router ${name} added correctly`;
        }
        else
          this.messageService.add({ severity: 'error', summary: `Node type ${nodeType} not recognized`});
        break;
      default:
        this.messageService.add({ severity: 'error', summary: `Type of node '${nodeType}' not found `});
    }

    // If a team has been specified, atomically add the node into it
    let command;
    if(!team) {
      command = addNodeCommand;
    } else {
      let addToTeamCommand = new AddMemberToTeamGroupCommand(team);
      command = addNodeCommand.bind(addToTeamCommand);
    }

    this.graphInvoker.executeCommand(command);
  }

  deleteNode(node) {
    this.graphInvoker.executeCommand(new RemoveNodeCommand(this.graphService.graph, node));
  }

  showNode(node: joint.shapes.microtosca.Node) {
    node.attr('./visibility', 'visible');
  }

  hideNode(node: joint.shapes.microtosca.Node) {
    node.attr('./visibility', 'collapse');
  }

  isNode(node: joint.dia.Cell): boolean {
    return this.graphService.graph.isNode(node);
  }

  isService(node: joint.shapes.microtosca.Node) {
    return this.graphService.graph.isService(node);
  }

  isCommunicationPattern(node: joint.shapes.microtosca.Node) {
    return this.graphService.graph.isCommunicationPattern(node);
  }

  isMessageBroker(node: joint.shapes.microtosca.Node) {
    return this.graphService.graph.isMessageBroker(node);
  }

  isDatastore(node: joint.shapes.microtosca.Node) {
    return this.graphService.graph.isDatastore(node);
  }

}
