import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamDetails } from '../team-details/team-details';
import { TeamsService } from '../teams.service';

@Injectable({
  providedIn: TeamsService
})
export class TeamsAnalyticsService {

  constructor(
    private graphService: GraphService
  ) { }

  getTeamDetails(team: joint.shapes.microtosca.SquadGroup): TeamDetails {
    let services: joint.shapes.microtosca.Service[] = this.getTeamServices(team);
    let datastores: joint.shapes.microtosca.Datastore[] = this.getTeamDatastores(team);
    let cps: joint.shapes.microtosca.CommunicationPattern[] = this.getTeamCommunicationPatterns(team);
    let nodes = {services: services, datastores: datastores, communicationPatterns: cps};
    let teamInteractions = this.getTeamInteractions(team);
    let edgeNodes = this.getTeamEdgeNodes(team);

    return new TeamDetails(team, nodes, teamInteractions, edgeNodes);
  }

  getTeamServices(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Service[] {
    return team.getMembers().filter(n => this.graphService.getGraph().isService(n)).map(n => <joint.shapes.microtosca.Service> n);
  }

  getTeamDatastores(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Datastore[] {
    return team.getMembers().filter(n => this.graphService.getGraph().isDatastore(n)).map(n => <joint.shapes.microtosca.Datastore> n);
  }

  getTeamCommunicationPatterns(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.CommunicationPattern[] {
    return team.getMembers().filter(n => this.graphService.getGraph().isCommunicationPattern(n)).map(n => <joint.shapes.microtosca.CommunicationPattern> n);
  }

  getTeamIngoingLinks(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.RunTimeLink[] {
    let graph = this.graphService.getGraph();
    return team.getMembers()
               .map((node) => this.graphService.getGraph().getIngoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), [])
               .filter((l) => !graph.isEdgeGroup(l.getSourceElement()));
  }

  getTeamOutgoingLinks(team: joint.shapes.microtosca.SquadGroup) {
    return team.getMembers()
               .map((node) => this.graphService.getGraph().getOutgoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), []);
  }

  getEdgeIngoingLinks(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.RunTimeLink[] {
    let graph = this.graphService.getGraph();
    return team.getMembers()
               .map((node) => this.graphService.getGraph().getIngoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), [])
               .filter((l) => graph.isEdgeGroup(l.getSourceElement()));
  }

  getTeamInteractions(team: joint.shapes.microtosca.SquadGroup): {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]} {
    let graph = this.graphService.getGraph();
    let groupingByTeam = (map, [group, link]) => {
                            if(!map.has(group))
                              map.set(group, [link]);
                            else
                              map.get(group).push(link);
                            return map;
                          };

    let ingoingLinks: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = 
      this.getTeamIngoingLinks(team)
          .map((link) => [graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), link])
          .reduce(groupingByTeam, new Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]>());

    let outgoingLinks: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = 
      this.getTeamIngoingLinks(team)
          .map((link) => [graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()), link])
          .reduce(groupingByTeam, new Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]>());

    return { ingoing: Array.from(ingoingLinks), outgoing: Array.from(outgoingLinks) };
  }

  getTeamEdgeNodes(team): joint.shapes.microtosca.Node[] {
    return this.getEdgeIngoingLinks(team).map((l) => <joint.shapes.microtosca.Node> l.getSourceElement());
  }

  getIngoingRequestSenderGroups(teamName): Map<joint.shapes.microtosca.Group, joint.shapes.microtosca.Node[]> {
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
}
