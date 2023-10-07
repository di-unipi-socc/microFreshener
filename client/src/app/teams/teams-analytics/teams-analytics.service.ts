import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsAnalyticsService {

  constructor(
    private graphService: GraphService
  ) { }

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
}
