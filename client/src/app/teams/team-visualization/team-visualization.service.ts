import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { Graph } from 'src/app/graph/model/graph';

@Injectable({
  providedIn: 'root'
})
export class TeamVisualizationService {

  visibleTeams: boolean;

  constructor(
    private graphService: GraphService
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

  showTeamDependencies(teamName) {
    let graph = this.graphService.getGraph();
    let team = graph.findGroupByName(teamName);
    graph.showTeamBox(team);
    this.graphService.getGraph().getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, true, "#007ad9");
        });
  }

  hideTeamDependencies(teamName) {
    let graph = this.graphService.getGraph();
    let team = graph.findGroupByName(teamName);
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
