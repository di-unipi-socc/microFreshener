import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import * as joint from 'jointjs';
import { AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand } from '../commands/team-commands';
import { Invoker } from '../commands/invoker/iinvoker';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TeamsManagementService {

  private graphInvoker: Invoker;
  public readonly TEAM_PADDING = 40;

  constructor(
    private graph: GraphService,
    private messageService: MessageService
  ) { }

  start(graphInvoker: Invoker) {
    this.graphInvoker = graphInvoker;
  }

    // Team editing

    addMemberToTeam(member: joint.shapes.microtosca.Node, team: joint.shapes.microtosca.SquadGroup) {
      var command = new AddMemberToTeamGroupCommand(this.graph.getGraph(), team.getName(), member.getName());
      this.graphInvoker.executeCommand(command);
      team.fitEmbeds({ padding: this.TEAM_PADDING });
      this.messageService.add({ severity: 'success', summary: 'Member added to  team', detail: `Node [${member.getName()}] added to [${team.getName()}] team` });
    }

    removeMemberFromTeam(member, team) {
      var command = new RemoveMemberFromTeamGroupCommand(this.graph.getGraph(), team.getName(), member.getName());
      this.graphInvoker.executeCommand(command);
      team.fitEmbeds({ padding: this.TEAM_PADDING });
      this.messageService.add({ severity: 'success', summary: 'Member removed from team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
    }

    // Team visualization

    showTeams() {
      this.graph.getGraph().showAllTeamBoxes();
    }
  
    hideTeams() {
      this.graph.getGraph().hideAllTeamBoxes();
    }
  
    showTeamDependencies(teamName) {
      let team = this.graph.getGraph().findGroupByName(teamName);
      team.attr("./visibility","visible");
      this.graph.getGraph().getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, true, "#007ad9");
          });
    }
    
    hideTeamDependencies(teamName) {
      let team = this.graph.getGraph().findGroupByName(teamName);
      team.attr("./visibility","hidden");
      this.graph.getGraph().getOutgoingLinksOfATeamFrontier(team)
          .forEach((link) => {
            this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, false);
          });
    }

    getIngoingRequestSenderGroups(teamName) {
      let graph = this.graph.getGraph();
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
      let team = this.graph.getGraph().getTeamOfNode(node);
      if(team != null)
        team.attr("./visibility", visibility);
    }
}
