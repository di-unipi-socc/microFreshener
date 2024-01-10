import { Injectable } from '@angular/core';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand, AddServiceCommand, RemoveNodeCommand } from './node-commands';
import { g } from 'jointjs';
import { AddMemberToTeamGroupCommand } from 'src/app/teams/team-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import { PermissionsService } from 'src/app/permissions/permissions.service';
import { TeamsService } from 'src/app/teams/teams.service';
import { SessionService } from 'src/app/core/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  constructor(
    private graphInvoker: GraphInvoker,
    private graphService: GraphService,
    private permissionsService: PermissionsService,
    private teamsService: TeamsService,
    private session: SessionService
  ) { }

  async addNode(nodeType: string, name: string, position?: g.Point, communicationPatternType?, team?: joint.shapes.microtosca.SquadGroup) {
    if(team && !this.permissionsService.writePermissions.isAllowed(team)) {
      Promise.reject(`You are not allowed to add this in ${team.getName()}.\nPlease contact the product owner or the team leader.`);
    }
    if(this.graphService.graph.findNodeByName(name)) {
      return Promise.reject(`${name} already exists.`);
    }
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
          return Promise.reject(`Node type ${nodeType} not recognized`);
        break;
      default:
        return Promise.reject(`Type of node '${nodeType}' not found `);
    }

    // If a team has been specified, atomically add the node into it
    let command;
    if(!team) {
      command = addNodeCommand;
    } else {
      let addToTeamCommand = new AddMemberToTeamGroupCommand(team);
      command = addNodeCommand.bind(addToTeamCommand);
    }

    return this.graphInvoker.executeCommand(command);
  }

  async deleteNode(node) {
    if(!this.permissionsService.writePermissions.isAllowed(node)) {
      return Promise.reject(`You are not allowed to delete this.`);
    }
    if(this.session.isTeam() && this.teamsService.hasTeamDependencies(node)) {
      return Promise.reject(`You cannot delete this because other teams interact with it.`);
    }
    return this.graphInvoker.executeCommand(new RemoveNodeCommand(this.graphService.graph, node));
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
