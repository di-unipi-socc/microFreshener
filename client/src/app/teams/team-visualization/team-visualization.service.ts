import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';

@Injectable({
  providedIn: 'root'// TeamsService
})
export class TeamVisualizationService {

  visibleTeams: boolean;

  constructor(
    private graphService: GraphService
  ) {
    this.visibleTeams = true;
  }

  showTeams() {
    this.graphService.graph.showAllTeamBoxes();
    this.visibleTeams = true;
  }

  hideTeams() {
    this.graphService.graph.hideAllTeamBoxes();
    this.visibleTeams = false;
  }

  areTeamsVisible(): boolean {
    return this.visibleTeams;
  }

  showTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    this.graphService.graph.showTeamBox(team);
    this.graphService.graph.getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, true, "#007ad9");
        });
  }

  hideTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    let graph = this.graphService.graph;
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
    /*if(linkColor)
      link.attr("line/stroke", linkColor);*/
    if(visibility == "visible")
      node.show();
    else
      node.hide();
    let graph = this.graphService.graph;
    let team = graph.getTeamOfNode(node);
    if(team != null)
      if(visibility == "visible") {
        graph.showTeamBox(team);
        team.attr("body/strokeDasharray", "10,5");
        //team.attr("body/fill", "#007ad9");
      } else { 
        graph.hideTeamBox(team);
      }
  }

  getNodesByTeam() {
    let graph = this.graphService.graph;
    let nodes: joint.shapes.microtosca.Node[] = graph.getNodes();
    // Group nodes by squad
    let nodesGroupedBySquads: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.Node[]> = nodes
      .map(node => [graph.getTeamOfNode(node), node])
      .reduce((map, [team, node]) => {
        let array = map.get(team);
        if(!array) map.set(team, [node])
        else array.push(node);
        return map;
      }, new Map());
    // Make the SelectItemGroup elements for the menu out of the grouped nodes
    let NO_TEAM_LABEL: string  = "Nodes owned by no one";
    let nodeList = Array.from(nodesGroupedBySquads
      .keys()).map((team) => {
      let items = nodesGroupedBySquads.get(team);
      return {
        label: team ? team.getName() : NO_TEAM_LABEL,
        value: team,
        items: (items ? items.map(node => ({ label: node.getName(), value: node })) : undefined)
      };
    });
    // Put unassigned nodes at the beginning of the list
    nodeList.sort((tA, tB) => {
      if(tA.label === NO_TEAM_LABEL)
        return -1;
      else if(tB.label === NO_TEAM_LABEL)
        return 1;
      else
        return 0;
    });

    return nodeList;
  }

  showOnlyTeam(team: joint.shapes.microtosca.SquadGroup) {
    this.graphService.graph.showOnlyTeam(team);
  }

}
