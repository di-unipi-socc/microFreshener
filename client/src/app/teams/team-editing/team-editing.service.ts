import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Command } from 'src/app/commands/icommand';
import { GraphInvoker } from 'src/app/commands/invoker';
import { AddMemberToTeamGroupCommand, AddTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from 'src/app/commands/team-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { Graph } from 'src/app/graph/model/graph';

@Injectable({
  providedIn: 'root'
})
export class TeamEditingService {

  constructor(
    private graphService: GraphService,
    private invoker: GraphInvoker,
    private messageService: MessageService
  ) { }

  // Team editing

  addTeam(name: string, selectedNodes?: joint.shapes.microtosca.Node[]) {
    let commandToExecute;
    if(!selectedNodes) {
      // Add a new empty team
      commandToExecute = new AddTeamGroupCommand(this.graphService.getGraph(), name);
    } else {
      // Add a new team and add its nodes atomically
      let createTeamThenMoveSelectedMembersIntoIt = this.buildCreateTeamThenAddNodesCommand(this.invoker, this.graphService.getGraph(), name, selectedNodes);
      commandToExecute = createTeamThenMoveSelectedMembersIntoIt;
    }
    this.invoker.executeCommand(commandToExecute);
  }

  private buildCreateTeamThenAddNodesCommand(invoker: GraphInvoker, graph: Graph, newTeamName: string, selectedNodes: joint.shapes.microtosca.Node[]): Command {
    let buildChangeNodeOwnershipCommand = this.buildMoveNodeCommand;
    return new class implements Command {
      private newTeamCommand: Command;
      private addOrMoveMembersToNewTeamCommands: Command[];
      execute() {
        // Create the new team
        this.newTeamCommand = new AddTeamGroupCommand(graph, newTeamName);
        this.newTeamCommand.execute();
        let newTeam = graph.findGroupByName(newTeamName);
        // Move nodes into it
        this.addOrMoveMembersToNewTeamCommands =
              selectedNodes
              .map((node) => [node, graph.getTeamOfNode(node)])
              .map(([node, previousTeam]: [joint.shapes.microtosca.Node, joint.shapes.microtosca.SquadGroup]) => {
                    if(previousTeam) return buildChangeNodeOwnershipCommand(node, previousTeam, newTeam)
                    else return new AddMemberToTeamGroupCommand(newTeam, node) });
        this.addOrMoveMembersToNewTeamCommands.forEach((cmd) => cmd.execute());
      }

      unexecute() {
        this.addOrMoveMembersToNewTeamCommands.forEach((cmd) => cmd.unexecute());
        this.newTeamCommand.unexecute();
      }
    }
  }

  private buildMoveNodeCommand(node: joint.shapes.microtosca.Node, fromTeam: joint.shapes.microtosca.SquadGroup, toTeam: joint.shapes.microtosca.SquadGroup) {
    return new class implements Command {
      removeMemberFromTeam;
      addMemberToTeam;
      execute() {
        this.removeMemberFromTeam = new RemoveMemberFromTeamGroupCommand(fromTeam, node);
        this.removeMemberFromTeam.execute();
        this.addMemberToTeam = new AddMemberToTeamGroupCommand(toTeam, node);
        this.addMemberToTeam.execute();
      }
      unexecute() {
        this.addMemberToTeam.unexecute();
        this.removeMemberFromTeam.unexecute();
      }
    }
  }

  addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    var command = new AddMemberToTeamGroupCommand(team, member);
    this.invoker.executeCommand(command);
    this.messageService.add({ severity: 'success', summary: 'Member added to  team', detail: `Node [${member.getName()}] added to [${team.getName()}] team` });
  }

  removeMemberFromTeam(member, team) {
    var command = new RemoveMemberFromTeamGroupCommand(team, member);
    this.invoker.executeCommand(command);
    this.messageService.add({ severity: 'success', summary: 'Member removed from team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
  }
}