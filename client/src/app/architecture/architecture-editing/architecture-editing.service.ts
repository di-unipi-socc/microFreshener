import { Injectable } from '@angular/core';
import { AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand, AddServiceCommand, NodeCommand, RemoveCommunicationPatternCommand, RemoveDatastoreCommand, RemoveNodeCommand, RemoveServiceCommand } from '../node-commands';
import { MessageService } from 'primeng/api';
import { GraphInvoker } from '../../commands/invoker';
import { GraphService } from '../../graph/graph.service';

import { g } from 'jointjs';
import { AddLinkCommand, RemoveLinkCommand } from '../link-commands';
import { EditorNavigationService } from '../../editor/navigation/navigation.service';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { AddMemberToTeamGroupCommand } from 'src/app/teams/team-commands';

@Injectable({
  providedIn: 'root'
})
export class ArchitectureEditingService {

  constructor(
    private graphInvoker: GraphInvoker,
    private graphService: GraphService,
    private navigation: EditorNavigationService,
    private messageService: MessageService,
  ) { }

  addNode(nodeType: string, name: string, position?: g.Point, communicationPatternType?, team?: joint.shapes.microtosca.SquadGroup) {
    let addNodeCommand;
    let message: string;
    switch (nodeType) {
      case ToolSelectionService.SERVICE:
        addNodeCommand = new AddServiceCommand(this.graphService.getGraph(), name, position);
        message = `Service ${name} added correctly`;
        break;
      case ToolSelectionService.DATASTORE:
        addNodeCommand = new AddDatastoreCommand(this.graphService.getGraph(), name, position);
        message = `Datastore  ${name}  added correctly`;
        break;
      case ToolSelectionService.COMMUNICATION_PATTERN:
        if(communicationPatternType === ToolSelectionService.MESSAGE_BROKER){
          addNodeCommand = new AddMessageBrokerCommand(this.graphService.getGraph(), name, position);
          message += `Message Broker ${name} added correctly`;
        }
        else if(communicationPatternType === ToolSelectionService.MESSAGE_ROUTER){
          addNodeCommand = new AddMessageRouterCommand(this.graphService.getGraph(), name, position);
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
      command = addNodeCommand.then(addToTeamCommand);
    }

    this.graphInvoker.executeCommand(command);
  }

  deleteNode(node) {
    this.graphInvoker.executeCommand(new RemoveNodeCommand(this.graphService.getGraph(), node));
  }

  addLink(leftClickSelectedNode, target, timeout?, circuit_breaker?, dynamic_discovery?) {
    console.log("selected, new ->", leftClickSelectedNode, target);
    var command = new AddLinkCommand(this.graphService.getGraph(), leftClickSelectedNode.getName(), target.getName(), timeout, circuit_breaker, dynamic_discovery);
    this.graphInvoker.executeCommand(command);
    this.navigation.getPaper().findViewByModel(leftClickSelectedNode).unhighlight();
    console.log("added link");
  }

  reverseLink(link) {
    let source = link.source();
    let target = link.target();
    link.source(target);
    link.target(source);
  }

  removeLink(link: joint.shapes.microtosca.RunTimeLink) {
    console.log("removing link called");
    this.graphInvoker.executeCommand(new RemoveLinkCommand(this.graphService.getGraph(), link));
  }

}