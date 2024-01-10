import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';
import { EditorNavigationService } from 'src/app/navigation/navigation.service';
import { Graph } from 'src/app/graph/model/graph';

@Injectable({
  providedIn: 'root'
})
export class TeamVisualizationService {

  private allTeamsVisible: boolean;
  private activeFilter: (graph: Graph) => void;
  private showTeamDependenciesFilter;

  constructor(
    private graphService: GraphService,
    private navigationService: EditorNavigationService
  ) {
    this.allTeamsVisible = true;
    this.showTeamDependenciesFilter = undefined;
  }

  areAllTeamsVisible(): boolean {
    return this.allTeamsVisible;
  }

  private unsetTeamVisualizationFilter() {
    if(this.activeFilter) {
      this.navigationService.removeFilter(this.activeFilter);
      this.activeFilter = undefined;
    }
  }

  private setTeamVisualizationFilter(filter: (graph: Graph) => void) {
    this.unsetTeamVisualizationFilter();
    this.activeFilter = filter;
    this.navigationService.addFilter(this.activeFilter);
    this.allTeamsVisible = false;
  }

  showTeams() {
      this.unsetTeamVisualizationFilter();
      this.graphService.graph.showAllTeamBoxes();
      this.allTeamsVisible = true;
  }

  hideTeams() {
    this.setTeamVisualizationFilter((graph) => { graph.hideAllTeamBoxes() });
  }

  showOnlyTeam(team: joint.shapes.microtosca.SquadGroup) {
    this.setTeamVisualizationFilter((graph) => { graph.showOnlyTeam(team) });
  }

  hoverTeam(team: joint.shapes.microtosca.SquadGroup, enlarge?: boolean) {
    team.attr("body/fill", "#007ad9");
    if(enlarge) team.fitEmbeds({ padding: Graph.TEAM_PADDING * 1.5 });
  }

  unhoverTeam(team: joint.shapes.microtosca.SquadGroup, shrink?: boolean) {
    team.attr("body/fill", "#ffffff");
    if(shrink) team.fitEmbeds({ padding: Graph.TEAM_PADDING });
  }

  unhoverAllTeams() {
    this.graphService.graph.getTeamGroups().forEach((team) => {
      team.attr("body/fill", "#ffffff");
      team.fitEmbeds({ padding: Graph.TEAM_PADDING });
    });
  }

  showTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    if(!this.showTeamDependenciesFilter) {
      this.showTeamDependenciesFilter = (graph) => {
        graph.showTeamBox(team);
        graph.getOutgoingLinksOfATeamFrontier(team)
            .forEach((link) => {
              this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, true);
            });
      };
      this.navigationService.addFilter(this.showTeamDependenciesFilter);
    }
  }

  hideTeamDependencies(team: joint.shapes.microtosca.SquadGroup) {
    this.navigationService.removeFilter(this.showTeamDependenciesFilter);
    this.showTeamDependenciesFilter = undefined;
    this.graphService.graph.hideTeamBox(team);
    this.graphService.graph.getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRespectiveNodesAndGroups(link, false);
        });
  }

  private setVisibilityOfLinkAndRespectiveNodesAndGroups(link: joint.shapes.microtosca.RunTimeLink, visible: boolean) {
    let node = <joint.shapes.microtosca.Node> link.getTargetElement();
    let visibility = visible ? "visible" : "hidden";
    link.attr("./visibility", visibility);
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

}
