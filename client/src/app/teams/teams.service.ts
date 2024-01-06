import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
import { TeamEditingService } from './team-editing/team-editing.service';
import { TeamVisualizationService } from './team-visualization/team-visualization.service';
import { TeamsAnalyticsService } from './team-analytics/teams-analytics.service';

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
    return this.visualization.areAllTeamsVisible();
  }

  getTeams(): joint.shapes.microtosca.SquadGroup[] {
    return this.editing.getTeams();
  }

  getNodesByTeams() {
    return this.analytics.getNodesByTeam();
  }

  getTeamOfNode(node: joint.shapes.microtosca.Node): joint.shapes.microtosca.SquadGroup {
    return this.editing.getTeamOfNode(node);
  }

  getTeam(teamName: string) {
    return this.editing.getTeam(teamName);
  }

  showOnlyTeam(team: joint.shapes.microtosca.SquadGroup) {
    return this.visualization.showOnlyTeam(team);
  }

  isTeamGroup(node: joint.dia.Cell): boolean {
    return this.editing.isTeamGroup(node);
  }

  // POV: admin

  async addTeam(name: string, selectedNodes?: joint.shapes.microtosca.Node[]) {
    return this.editing.addTeam(name, selectedNodes);
  }

  async removeTeam(team: joint.shapes.microtosca.SquadGroup) {
    return this.editing.removeTeam(team);
  }

  async addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    return this.editing.addMemberToTeam(member, team);
  }

  async removeMemberFromTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
    return this.editing.removeMemberFromTeam(member, team);
  }

  // POV: team member

  showTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    this.visualization.showTeamDependencies(team);
  }

  hideTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    this.visualization.hideTeamDependencies(team);
  }

  getTeamInteractions(team: joint.shapes.microtosca.SquadGroup): {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]} {
    return this.analytics.getTeamInteractions(team);
  }

  getTeamDetails(team: joint.shapes.microtosca.SquadGroup): {
    team: joint.shapes.microtosca.SquadGroup,
    services: joint.shapes.microtosca.Service[],
    datastores: joint.shapes.microtosca.Datastore[],
    communicationPatterns: joint.shapes.microtosca.CommunicationPattern[],
    teamInteractions: {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]},
    edge: joint.shapes.microtosca.Node[]
  } {
    return this.analytics.getTeamDetails(team);
  }

  getTeamEdgeNodes(team): joint.shapes.microtosca.Node[] {
    return this.analytics.getTeamEdgeNodes(team);
  }

  hasTeamDependencies(node: joint.shapes.microtosca.Node): boolean {
    return this.analytics.hasTeamDependencies(node);
  }

}
