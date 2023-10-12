import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamsService } from '../teams.service';
import { TeamsAnalyticsService } from '../team-analytics/teams-analytics.service';
import * as joint from 'jointjs';

@Injectable({
  providedIn: TeamsService
})
export class TeamVisualizationService {

  visibleTeams: boolean;

  constructor(
    private graphService: GraphService,
    private analytics: TeamsAnalyticsService
  ) {
    this.visibleTeams = false;
  }

  showTeams() {
    this.graphService.getGraph().showAllTeamBoxes();
    this.visibleTeams = true;
  }

  hideTeams() {
    this.graphService.getGraph().hideAllTeamBoxes();
    this.visibleTeams = false;
  }

  areTeamsVisible(): boolean {
    return this.visibleTeams;
  }

  showTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    let graph = this.graphService.getGraph();
    graph.showTeamBox(team);
    this.graphService.getGraph().getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, true, "#007ad9");
        });
  }

  hideTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    let graph = this.graphService.getGraph();
    graph.hideTeamBox(team);
    graph.getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, false);
        });
  }

  private setVisibilityOfLinkAndRespectiveNodesAndGroups(link: joint.shapes.microtosca.RunTimeLink, visible: boolean, linkColor?: string) {
    let node = <joint.shapes.microtosca.Node> link.getTargetElement();
    let visibility = visible ? "visible" : "hidden";
    link.attr("./visibility", visibility);
    if(linkColor)
      link.attr("line/stroke", linkColor);
    node.attr("./visibility", visibility);
    let graph = this.graphService.getGraph();
    let team = graph.getTeamOfNode(node);
    if(team != null)
      if(visibility == "visible")
        graph.showTeamBox(team);
      else
        graph.hideTeamBox(team);
  }


}
