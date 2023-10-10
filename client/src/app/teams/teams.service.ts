import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
import { TeamEditingService } from './team-editing/team-editing.service';
import { TeamVisualizationService } from './team-visualization/team-visualization.service';
import { TeamsAnalyticsService } from './team-analytics/teams-analytics.service';
import { TeamDetails } from './team-details/team-details';

@Injectable({
  providedIn:'root'
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

  areVisible(): boolean {
    return this.visualization.areTeamsVisible();
  }

  // POV: admin

  addTeam(name: string, selectedNodes?: joint.shapes.microtosca.Node[]) {
    this.editing.addTeam(name, selectedNodes);
  }

  removeTeam(team: joint.shapes.microtosca.SquadGroup) {
    this.editing.removeTeam(team);
  }

  addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    this.editing.addMemberToTeam(member, team);
  }

  removeMemberFromTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    this.editing.removeMemberFromTeam(member, team);
  }

  // POV: team member

  showTeamDependencies(teamName: string) {
    this.visualization.showTeamDependencies(teamName);
  }

  hideTeamDependencies(teamName: string) {
    this.visualization.hideTeamDependencies(teamName);
  }

  getTeamInteractions(team: joint.shapes.microtosca.SquadGroup): {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]} {
    return this.analytics.getTeamInteractions(team);
  }

  getIngoingRequestSenderGroups(teamName): Map<joint.shapes.microtosca.Group, joint.shapes.microtosca.Node[]> {
    return this.analytics.getIngoingRequestSenderGroups(teamName);
  }

  getTeamDetails(team: joint.shapes.microtosca.SquadGroup): TeamDetails {
    return this.analytics.getTeamDetails(team);
  }

}
