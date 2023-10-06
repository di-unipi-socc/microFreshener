import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';
import { AddMemberToTeamGroupCommand, AddTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from '../commands/team-commands';
import { GraphInvoker } from '../commands/invoker';
import { MessageService } from 'primeng/api';
import { Graph } from '../graph/model/graph';
import { Command } from '../commands/icommand';
import { TeamEditingService } from './team-editing/team-editing.service';
import { TeamVisualizationService } from './team-visualization/team-visualization.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  public readonly TEAM_PADDING;

  constructor(
    private editing: TeamEditingService,
    private visualization: TeamVisualizationService
  ) {}

  showTeams() {
    this.visualization.showTeams();
  }

  hideTeams() {
    this.visualization.hideTeams();
  }

  addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    this.editing.addMemberToTeam(member, team);
  }

  removeMemberFromTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    this.editing.removeMemberFromTeam(member, team);
  }

  // POV: admin

  addTeam(name: string, selectedNodes?: joint.shapes.microtosca.Node[]) {
    this.editing.addTeam(name, selectedNodes);
  }

  // POV: team member

  showTeamDependencies(teamName: string) {
    this.visualization.showTeamDependencies(teamName);
  }

  hideTeamDependencies(teamName: string) {
    this.visualization.hideTeamDependencies(teamName);
  }

  getIngoingRequestSenderGroups(teamName) {
    this.visualization.getIngoingRequestSenderGroups(teamName);
  }

}
