import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsManagementService {

  constructor(private gs: GraphService) { }

    // Teams

    showTeams() {
      this.gs.getGraph().showAllTeamBoxes();
    }
  
    hideTeams() {
      this.gs.getGraph().hideAllTeamBoxes();
    }
  
    showTeamDependencies(teamName) {
      let team = this.gs.getGraph().findGroupByName(teamName);
      team.attr("./visibility","visible");
      this.gs.getGraph().getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, true, "#007ad9");
          });
    }
    
    hideTeamDependencies(teamName) {
      let team = this.gs.getGraph().findGroupByName(teamName);
      team.attr("./visibility","hidden");
      this.gs.getGraph().getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, false);
          });
    }
  
    private setVisibilityOfLinkAndRelatedNodesAndGroups(link: joint.shapes.microtosca.RunTimeLink, visible: boolean, linkColor?: string) {
      let node = <joint.shapes.microtosca.Node> link.getTargetElement();
      let visibility = visible ? "visible" : "hidden";
      link.attr("./visibility", visibility);
      if(linkColor)
        link.attr("line/stroke", linkColor);
      node.attr("./visibility", visibility);
      let team = this.gs.getGraph().getTeamOfNode(node);
      if(team != null)
        team.attr("./visibility", visibility);
    }
}
