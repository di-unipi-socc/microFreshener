import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
import { TeamEditingService } from './team-editing/team-editing.service';
import { TeamVisualizationService } from './team-visualization/team-visualization.service';
import { TeamsAnalyticsService } from './teams-analytics/teams-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private editing: TeamEditingService,
    private visualization: TeamVisualizationService,
    private analytics: TeamsAnalyticsService
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

  getIngoingRequestSenderGroups(teamName): Map<joint.shapes.microtosca.Group, joint.shapes.microtosca.Node[]> {
    return this.analytics.getIngoingRequestSenderGroups(teamName);
  }

}