import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Command } from 'src/app/commands/icommand';
import { GraphInvoker } from 'src/app/commands/invoker';
import { AddMemberToTeamGroupCommand, AddTeamGroupCommand, RemoveMemberFromTeamGroupCommand, RemoveTeamGroupCommand } from '../team-commands';
import { GraphService } from 'src/app/graph/graph.service';
import { Graph } from 'src/app/graph/model/graph';
import { TeamsService } from '../teams.service';

@Injectable({
  providedIn: 'root'// TeamsService
})
export class TeamEditingService {

  constructor(
    private graphService: GraphService,
    private invoker: GraphInvoker,
    private messageService: MessageService
  ) { }

  getTeams(): joint.shapes.microtosca.SquadGroup[] {
    return this.graphService.getGraph().getTeamGroups();
  }

  addTeam(name: string, selectedNodes?: joint.shapes.microtosca.Node[]) {
    let commandToExecute;
    if(!selectedNodes) {
      // Add a new empty team
      commandToExecute = new AddTeamGroupCommand(this.graphService.getGraph(), name);
    } else {
      // Add a new team and add its nodes atomically
      let createTeamThenMoveSelectedMembersIntoIt = this.buildCreateTeamThenAddNodesCommand(this.graphService.getGraph(), name, selectedNodes);
      commandToExecute = createTeamThenMoveSelectedMembersIntoIt;
    }
    this.invoker.executeCommand(commandToExecute);
  }

  removeTeam(team: joint.shapes.microtosca.SquadGroup) {
    this.invoker.executeCommand(new RemoveTeamGroupCommand(this.graphService.getGraph(), team));
  }

  private buildCreateTeamThenAddNodesCommand(graph: Graph, newTeamName: string, selectedNodes: joint.shapes.microtosca.Node[]): Command {
    let buildMoveNodeCommand = this.buildMoveNodeCommand;
    return new class implements Command {
      private newTeamCommand: Command;
      private addOrMoveMembersToNewTeamCommands: Command[];
      execute() {
        // Create the new team
        this.newTeamCommand = new AddTeamGroupCommand(graph, newTeamName);
        this.newTeamCommand.execute();
        let newTeam = graph.findTeamByName(newTeamName);
        // Move nodes into it
        this.addOrMoveMembersToNewTeamCommands =
              selectedNodes
              .map((node) => [node, graph.getTeamOfNode(node)])
              .map(([node, previousTeam]: [joint.shapes.microtosca.Node, joint.shapes.microtosca.SquadGroup]) => {
                    if(previousTeam) { console.log("previousTeam: node, team", node.getName(), previousTeam.getName()); return buildMoveNodeCommand(node, previousTeam, newTeam); }
                    else { return new AddMemberToTeamGroupCommand(newTeam, node); } });
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
      constructor() {
        this.removeMemberFromTeam = new RemoveMemberFromTeamGroupCommand(fromTeam, node)
        this.addMemberToTeam = new AddMemberToTeamGroupCommand(toTeam, node);
      }
      execute() {
        this.removeMemberFromTeam.execute();
        this.addMemberToTeam.execute();
      }
      unexecute() {
        this.addMemberToTeam.unexecute();
        this.removeMemberFromTeam.unexecute();
      }
    }
  }

  addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    let previousTeam = this.graphService.getGraph().getTeamOfNode(member);
    let command;
    if(previousTeam) {
      command = this.buildMoveNodeCommand(member, previousTeam, team);
    } else {
      command = new AddMemberToTeamGroupCommand(team, member);
    }
    this.invoker.executeCommand(command);
    this.messageService.add({ severity: 'success', summary: 'Member added to  team', detail: `Node [${member.getName()}] added to [${team.getName()}] team` });
  }

  removeMemberFromTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    var command = new RemoveMemberFromTeamGroupCommand(team, member);
    this.invoker.executeCommand(command);
    this.messageService.add({ severity: 'success', summary: 'Member removed from team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
  }
}
