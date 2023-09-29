import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';

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

    getIngoingRequestSenderGroups(teamName) {
      let graph = this.gs.getGraph();
      let team = graph.findGroupByName(teamName);
      // Get the links that go from the outside to team's
      return graph.getIngoingLinksOfATeamFrontier(team)
                  // Get (source, target) pairs from graph links
                  .map((link) => [link.getSourceElement(), link.getTargetElement()])
                  // Transform them to (target, source's group) pairs
                  .map( (sourceTargetPair) =>
                    [!graph.isEdgeGroup(sourceTargetPair[0]) ? graph.getTeamOfNode(<joint.shapes.microtosca.Node> sourceTargetPair[0]) : <joint.shapes.microtosca.EdgeGroup> sourceTargetPair[0],
                    sourceTargetPair[1]] )
                  // Accumulate in a dictionary removing duplicates
                  .reduce((dict, sourceTargetPair) => {
                    let senderGroup = <joint.shapes.microtosca.Group> sourceTargetPair[0];
                    let targetNode = <joint.shapes.microtosca.Node> sourceTargetPair[1];
                    if(!dict.has(senderGroup)) {
                      dict.set(senderGroup, [targetNode]);
                    } else {
                      let nodes = dict.get(senderGroup);
                      if(!nodes.includes(targetNode)) {
                        nodes.push(targetNode);
                      }
                    }
                    return dict;
                  }, new Map<joint.shapes.microtosca.Group, joint.shapes.microtosca.Node[]>());
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
