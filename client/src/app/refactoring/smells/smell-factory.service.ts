import { Injectable } from '@angular/core';
import { GroupSmell, NodeSmell } from './smell';
import { GraphService } from '../../graph/graph.service';
import { SharedPersistencySmellObject } from './shared-persistency';
import { NoApiGatewaySmellObject } from './no-api-gateway';
import { SingleLayerTeamsSmellObject } from './single-layer-teams';
import { TightlyCoupledTeamsSmellObject } from './tightly-coupled-teams';
import { SharedBoundedContextSmellObject } from './shared-bounded-context';
import { GroupRefactoring, Refactoring } from '../refactorings/refactoring-command';
import { EndpointBasedServiceInteractionSmellObject } from './endpoint-based-service-interaction';
import { MultipleServicesPerDeploymentUnitSmellObject } from './multiple-services-in-one-container';
import { WobblyServiceInteractionSmellObject } from './wobbly-service-interaction';
import * as joint from 'jointjs';
import { SessionService } from '../../core/session/session.service';
import { RefactoringFactoryService } from '../refactorings/refactoring-factory.service';

enum SMELL_NAMES {
  SMELL_ENDPOINT_BASED_SERVICE_INTERACTION = "Endpoint-based-service-interaction",
  SMELL_WOBBLY_SERVICE_INTERACTION_SMELL = "Wobbly-service-interaction",
  SMELL_SHARED_PERSISTENCY = "Shared-persistency",
  SMELL_NO_API_GATEWAY = "No-api-gateway",
  SMELL_SINGLE_LAYER_TEAMS = "Single-layer-teams",
  SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER = "Multiple-services-in-one-container",
  SMELL_TIGHTLY_COUPLED_TEAMS = "Tightly-coupled-teams",
  SMELL_SHARED_BOUNDED_CONTEXT = "Shared-bounded-context"
}

@Injectable({
  providedIn: 'root'
})
export class SmellFactoryService {

  constructor(
    private gs: GraphService,
    private refactoring: RefactoringFactoryService,
    private session: SessionService
  ) {}

  getNodeSmell(smellJson, node): NodeSmell {
    let smell: NodeSmell;

    switch (smellJson.name) {
      case SMELL_NAMES.SMELL_ENDPOINT_BASED_SERVICE_INTERACTION:
        smell = new EndpointBasedServiceInteractionSmellObject(node);
        break;
      case SMELL_NAMES.SMELL_WOBBLY_SERVICE_INTERACTION_SMELL:
        smell = new WobblyServiceInteractionSmellObject(node);
        break;
      case SMELL_NAMES.SMELL_SHARED_PERSISTENCY:
        smell = new SharedPersistencySmellObject(node);
        break;
      case SMELL_NAMES.SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER:
        smell = new MultipleServicesPerDeploymentUnitSmellObject(node);
        break;
      default:
        throw new Error(`Unsupported smell: ${smellJson.name}`);
    }

    smellJson['links'].forEach((cause) => {
      if(smellJson.name == SMELL_NAMES.SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER)
        console.debug("Analysing link cause msioc", cause)
      var source = this.gs.graph.findNodeByName(cause['source']);
      var target = this.gs.graph.findNodeByName(cause['target']);
      var link = this.gs.graph.getLinkFromSourceToTarget(source, target);
      if(smellJson.name == SMELL_NAMES.SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER)
        console.debug("Retrieved link", link)
      smell.addLinkBasedCause(link);
      smell.addNodeBasedCause(node);
    });

    smellJson['refactorings'].forEach((refactoringJson) => {
      let refactoringName = refactoringJson['name'];
      let refactoring: Refactoring = this.refactoring.getRefactoring(refactoringName, smell);
      if(refactoring)
        smell.addRefactoring(refactoring);
    });
    smell.addRefactoring(this.refactoring.getIgnoreRefactoring(node, smell));

    return smell;
  }

  getGroupSmell(smellJson, group: joint.shapes.microtosca.Group): (GroupSmell | GroupSmell[]) {
    console.debug("Getting smell for", smellJson.name);
    if(!this.session.isAdmin) return;
    
    let smell: GroupSmell;

    switch (smellJson.name) {
      case SMELL_NAMES.SMELL_NO_API_GATEWAY:
        smell = new NoApiGatewaySmellObject(<joint.shapes.microtosca.EdgeGroup> group);
        break;
      case SMELL_NAMES.SMELL_SINGLE_LAYER_TEAMS:
        smell = new SingleLayerTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      case SMELL_NAMES.SMELL_TIGHTLY_COUPLED_TEAMS:
        smell = new TightlyCoupledTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      case SMELL_NAMES.SMELL_SHARED_BOUNDED_CONTEXT:
        smell = new SharedBoundedContextSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      default:
        throw new Error(`Unsupported smell: ${smellJson.name}`);
    }

    if(smell instanceof NoApiGatewaySmellObject) {
      return this.getEdgeGroupSmell(smellJson, smell);
    } else {
      return this.getWholeGroupSmell(<joint.shapes.microtosca.SquadGroup> group, smellJson, smell);
    }
  }

  private getWholeGroupSmell(group: joint.shapes.microtosca.SquadGroup, smellJson, smell): GroupSmell {

    smellJson['nodes'].forEach((node_name) => {
      let node = this.gs.graph.findNodeByName(node_name);
      smell.addNodeBasedCause(node);
    });

    smellJson['links'].forEach((link_cause) => {
      let source = this.gs.graph.findNodeByName(link_cause['source']);
      let target = this.gs.graph.findNodeByName(link_cause['target']);
      let link = this.gs.graph.getLinkFromSourceToTarget(source, target);
      smell.addLinkBasedCause(link);
    });

    smellJson['refactorings'].forEach((refactoringJson) => {
      let refactoringName = refactoringJson['name'];
      console.debug("Analysing refactoring", refactoringName);
      let refactoring: GroupRefactoring = <GroupRefactoring> this.refactoring.getRefactoring(refactoringName, smell);
      if(refactoring) smell.addRefactoring(refactoring);
    });
    smell.addRefactoring(this.refactoring.getIgnoreRefactoring(group, smell));

    return smell;

  }

  private getEdgeGroupSmell(smellJson, edgeGroupSmell): GroupSmell[] {

    let nodes = [];

    smellJson['nodes'].forEach((node_name) => {
      let node = this.gs.graph.findNodeByName(node_name);
      nodes.push(node);
    });

    return nodes.map((node) => {
      let nodeSmell = new NoApiGatewaySmellObject(<joint.shapes.microtosca.EdgeGroup> edgeGroupSmell.getGroup());
      nodeSmell.addNodeBasedCause(node);
      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        console.debug("Analysing refactoring", refactoringName);
        let refactoring: GroupRefactoring = <GroupRefactoring> this.refactoring.getRefactoring(refactoringName, nodeSmell);
        nodeSmell.addRefactoring(refactoring);
      });
      nodeSmell.addRefactoring(this.refactoring.getIgnoreRefactoring(node, nodeSmell));
      nodeSmell.getNode = () => node;
      return nodeSmell;
    })

  }

}