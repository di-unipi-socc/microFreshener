import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'// TeamsService
})
export class TeamsAnalyticsService {

  constructor(
    private graphService: GraphService
  ) { }

  getTeamDetails(team: joint.shapes.microtosca.SquadGroup): {
    team: joint.shapes.microtosca.SquadGroup,
    services: joint.shapes.microtosca.Service[],
    datastores: joint.shapes.microtosca.Datastore[],
    communicationPatterns: joint.shapes.microtosca.CommunicationPattern[],
    teamInteractions: {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]},
    edge: joint.shapes.microtosca.Node[]
  } {
    let details = {
      team: team,
      services: this.getTeamServices(team),
      datastores: this.getTeamDatastores(team),
      communicationPatterns: this.getTeamCommunicationPatterns(team),
      teamInteractions: this.getTeamInteractions(team),
      edge: this.getTeamEdgeNodes(team)
    }
    return details;
  }

  getTeamServices(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Service[] {
    return team.getMembers().filter(n => this.graphService.graph.isService(n)).map(n => <joint.shapes.microtosca.Service> n);
  }

  getTeamDatastores(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.Datastore[] {
    return team.getMembers().filter(n => this.graphService.graph.isDatastore(n)).map(n => <joint.shapes.microtosca.Datastore> n);
  }

  getTeamCommunicationPatterns(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.CommunicationPattern[] {
    return team.getMembers().filter(n => this.graphService.graph.isCommunicationPattern(n)).map(n => <joint.shapes.microtosca.CommunicationPattern> n);
  }

  getTeamIngoingLinks(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.RunTimeLink[] {
    let graph = this.graphService.graph;
    return team.getMembers()
               .map((node) => this.graphService.graph.getIngoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), [])
               .filter((l) => !graph.isEdgeGroup(l.getSourceElement()))
               .filter((l) => graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getSourceElement()) != team);
  }

  getTeamOutgoingLinks(team: joint.shapes.microtosca.SquadGroup) {
    let graph = this.graphService.graph;
    return team.getMembers()
               .map((node) => this.graphService.graph.getOutgoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), [])
               .filter((l) => l.getTargetElement() && graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getTargetElement()) != team);
  }

  getEdgeIngoingLinks(team: joint.shapes.microtosca.SquadGroup): joint.shapes.microtosca.RunTimeLink[] {
    let graph = this.graphService.graph;
    return team.getMembers()
               .map((node) => this.graphService.graph.getIngoingLinks(node))
               .reduce((ingoingTeamLinks, nodeLinks) => ingoingTeamLinks.concat(nodeLinks), [])
               .filter((l) => graph.isEdgeGroup(l.getSourceElement()));
  }

  getTeamInteractions(team: joint.shapes.microtosca.SquadGroup): {ingoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][], outgoing: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][]} {
    let graph = this.graphService.graph;
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
          .filter(([g, l]) => g && graph.isTeamGroup(g))
          .reduce(groupingByTeam, new Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]>());

    let outgoingLinks: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = 
      this.getTeamOutgoingLinks(team)
          .map((link) => [graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement()), link])
          .filter(([g, l]) => g && graph.isTeamGroup(g))
          .reduce(groupingByTeam, new Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]>());

    return { ingoing: Array.from(ingoingLinks), outgoing: Array.from(outgoingLinks) };
  }

  getTeamEdgeNodes(team): joint.shapes.microtosca.Node[] {
    return this.getEdgeIngoingLinks(team).map((l) => <joint.shapes.microtosca.Node> l.getTargetElement());
  }

  hasTeamDependencies(node: joint.shapes.microtosca.Node): boolean {
    let nodeTeam = this.graphService.graph.getTeamOfNode(node);
    return this.graphService.graph.getIngoingLinks(node)
                                  .map((n) => this.graphService.graph.getTeamOfNode(<joint.shapes.microtosca.Node> n.getSourceElement()))
                                  .filter((t) => t != nodeTeam).length != 0;
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

}
