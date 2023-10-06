import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';
import { AddMemberToTeamGroupCommand, AddTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from '../commands/team-commands';
import { GraphInvoker } from '../commands/invoker';
import { MessageService } from 'primeng/api';
import { Graph } from '../graph/model/graph';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  public readonly TEAM_PADDING;

  constructor(
    private graphInvoker: GraphInvoker,
    private graphService: GraphService,
    private messageService: MessageService
  ) {
    this.TEAM_PADDING = Graph.TEAM_PADDING;
  }

    // Team editing

    addTeam(name: string, nodes?: joint.shapes.microtosca.Node[]) { // TODO should use the command
      this.graphInvoker.executeCommand(new AddTeamGroupCommand(this.graphService.getGraph(), name));
    }

    addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
      var command = new AddMemberToTeamGroupCommand(team, member);
      this.graphInvoker.executeCommand(command);
      this.messageService.add({ severity: 'success', summary: 'Member added to  team', detail: `Node [${member.getName()}] added to [${team.getName()}] team` });
    }

    removeMemberFromTeam(member, team) {
      var command = new RemoveMemberFromTeamGroupCommand(team, member);
      this.graphInvoker.executeCommand(command);
      this.messageService.add({ severity: 'success', summary: 'Member removed from team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
    }

    // Team visualization

    showTeams() {
      this.graphService.getGraph().showAllTeamBoxes();
    }
  
    hideTeams() {
      this.graphService.getGraph().hideAllTeamBoxes();
    }
  
    showTeamDependencies(teamName) {
      let graph = this.graphService.getGraph();
      let team = graph.findGroupByName(teamName);
      graph.showTeamBox(team);
      this.graphService.getGraph().getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, true, "#007ad9");
          });
    }
    
    hideTeamDependencies(teamName) {
      let graph = this.graphService.getGraph();
      let team = graph.findGroupByName(teamName);
      graph.hideTeamBox(team);
      graph.getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, false);
          });
    }

    getIngoingRequestSenderGroups(teamName) {
      let graph = this.graphService.getGraph();
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
      let graph = this.graphService.getGraph();
      let team = graph.getTeamOfNode(node);
      if(team != null)
        if(visibility == "visible")
          graph.showTeamBox(team);
        else
          graph.hideTeamBox(team);
    }
}
