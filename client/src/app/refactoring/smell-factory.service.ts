import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smells/smell';
import { REFACTORING_NAMES, SMELL_NAMES } from './constants';
import { GraphService } from '../graph/graph.service';
import { SharedPersistencySmellObject } from './smells/shared-persistency';
import { NoApiGatewaySmellObject } from './smells/no-api-gateway';
import { SingleLayerTeamsSmellObject } from './smells/single-layer-teams';
import { TightlyCoupledTeamsSmell } from './smells/tightly-coupled-teams';
import { GroupRefactoring, Refactoring } from './refactorings/refactoring-command';
import { EndpointBasedServiceInteractionSmellObject } from './smells/endpoint-based-service-interaction';
import { MultipleServicesInOneContainerSmellObject } from './smells/multiple-services-in-one-container';
import { WobblyServiceInteractionSmellObject } from './smells/wobbly-service-interaction';
import { AddApiGatewayRefactoring } from './refactorings/add-api-gateway-refactoring-command';
import { AddCircuitBreakerRefactoring } from './refactorings/add-circuit-breaker';
import { AddDataManagerRefactoring } from './refactorings/add-data-manager';
import { AddMessageBrokerRefactoring } from './refactorings/add-message-broker';
import { AddMessageRouterRefactoring } from './refactorings/add-message-router';
import { AddServiceDiscoveryRefactoring } from './refactorings/add-service-discovery';
import { MergeServicesRefactoring } from './refactorings/merge-services-refactoring';
import { SplitDatastoreRefactoring } from './refactorings/split-database';
import { UseTimeoutRefactoring } from './refactorings/use-timeout';
import { IgnoreOnceRefactoring, IgnoreAlwaysRefactoring } from './refactorings/ignore-refactoring-commands';
import * as joint from 'jointjs';
import { SplitTeamsByService as SplitTeamsByServiceRefactoring } from './refactorings/split-teams-by-service';
import { SplitTeamsByCouplingRefactoring } from './refactorings/split-teams-by-coupling';

@Injectable({
  providedIn: 'root'
})
export class SmellFactoryService {

  constructor(
    private gs: GraphService,
  ) {}

  getNodeSmell(smellJson, node): SmellObject {
    let smell: SmellObject;

    switch (smellJson.name) {
      case SMELL_NAMES.SMELL_ENDPOINT_BASED_SERVICE_INTERACTION:
        smell = new EndpointBasedServiceInteractionSmellObject();
        break;
      case SMELL_NAMES.SMELL_WOBBLY_SERVICE_INTERACTION_SMELL:
        smell = new WobblyServiceInteractionSmellObject();
        break;
      case SMELL_NAMES.SMELL_SHARED_PERSISTENCY:
        smell = new SharedPersistencySmellObject();
        break;
      case SMELL_NAMES.SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER:
        smell = new MultipleServicesInOneContainerSmellObject();
      default:
        console.warn(`Unsupported smell: ${smellJson.name}`);
    }

    if(smell) {
      smellJson['links'].forEach((cause) => {
        var source = this.gs.getGraph().findNodeByName(cause['source']);
        var target = this.gs.getGraph().findNodeByName(cause['target']);
        var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        smell.addLinkBasedCause(link);
        smell.addNodeBasedCause(node)
      });

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactoring: Refactoring = this.getNodeRefactoring(refactoringName, smell);
        smell.addRefactoring(refactoring);
      });
      smell.addRefactoring(new IgnoreOnceRefactoring(node, smell));
      smell.addRefactoring(new IgnoreAlwaysRefactoring(node, smell));
      return smell;
    }
  }

  private getNodeRefactoring(refactoringName: string, smell: SmellObject): Refactoring {

    switch (refactoringName) {

      case REFACTORING_NAMES.REFACTORING_ADD_MESSAGE_ROUTER:
        return new AddMessageRouterRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_MESSAGE_BROKER:
        return new AddMessageBrokerRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_SERVICE_DISCOVERY:
        return new AddServiceDiscoveryRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_CIRCUIT_BREAKER:
        return new AddCircuitBreakerRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_USE_TIMEOUT:
        return new UseTimeoutRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_MERGE_SERVICES:
        return new MergeServicesRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_SPLIT_DATASTORE:
        return new SplitDatastoreRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_DATA_MANAGER:
        return new AddDataManagerRefactoring(this.gs.getGraph(), smell);
    }
  }

  getGroupSmell(smellJson, group): GroupSmellObject {
    let smell: GroupSmellObject;
    switch (smellJson.name) {
      case SMELL_NAMES.SMELL_NO_API_GATEWAY:
        smell = new NoApiGatewaySmellObject(<joint.shapes.microtosca.EdgeGroup> group);
        break;
      case SMELL_NAMES.SMELL_SINGLE_LAYER_TEAMS:
        smell = new SingleLayerTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      case SMELL_NAMES.SMELL_TIGHTLY_COUPLED_TEAMS:
        smell = new TightlyCoupledTeamsSmell(<joint.shapes.microtosca.SquadGroup> group);
        break;
      default:
        console.warn(`Unsupported smell: ${smellJson.name}`);
    }

    if(smell) {
      smellJson['nodes'].forEach((node_name) => {
        let node = this.gs.getGraph().findNodeByName(node_name);
        smell.addNodeBasedCause(node);
      });
      
      smellJson['links'].forEach((link_cause) => {
        let source = this.gs.getGraph().findNodeByName(link_cause['source']);
        let target = this.gs.getGraph().findNodeByName(link_cause['target']);
        let link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        smell.addLinkBasedCause(link);
      });

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactoring: GroupRefactoring = this.getGroupRefactoring(refactoringName, smell);
        smell.addRefactoring(refactoring);
        // Add partial member refactoring to members' smells
        let membersRefactorings = refactoring.getMemberRefactorings();
        let subSmells = new Map<joint.shapes.microtosca.Node, SmellObject>();
        membersRefactorings?.forEach((refactorings, member) => {
            let memberSmell = subSmells.get(member);
            if(!memberSmell) {
                memberSmell = new SmellObject(`${smell.getName()} in ${smell.getGroup().getName()}`, smell.getGroup());
                subSmells.set(member, memberSmell);
            }
            refactorings.forEach((r) => memberSmell.addRefactoring(r));
            memberSmell.addRefactoring(new IgnoreOnceRefactoring(member, smell));
            memberSmell.addRefactoring(new IgnoreAlwaysRefactoring(member, smell));
        });
        smell.setSubSmells(subSmells);
      });

      smell.addRefactoring(new IgnoreOnceRefactoring(group, smell));
      smell.addRefactoring(new IgnoreAlwaysRefactoring(group, smell));
      
      return smell;
    }
  }

  private getGroupRefactoring(refactoringName: string, smell: GroupSmellObject): GroupRefactoring {
    
    switch(refactoringName){

      case REFACTORING_NAMES.REFACTORING_ADD_API_GATEWAY:
        return new AddApiGatewayRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_SPLIT_TEAMS_BY_SERVICE:
        return new SplitTeamsByServiceRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_SPLIT_TEAMS_BY_COUPLING:
        return new SplitTeamsByCouplingRefactoring(this.gs.getGraph(), smell);
    }
  }

}
