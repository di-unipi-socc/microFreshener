import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { REFACTORING_NAMES, SMELL_NAMES } from './costants';
import { GraphService } from '../graph/graph.service';
import { SharedPersistencySmellObject } from './smells/shared-persistency';
import { NoApiGatewaySmellObject } from './group-smells/no-api-gateway';
import { SingleLayerTeamsSmellObject } from './group-smells/single-layer-teams';
import { TightlyCoupledTeamsSmell } from './group-smells/tightly-coupled-teams';
import { Refactoring } from './refactoring-commands/refactoring-command';
import { EndpointBasedServiceInteractionSmellObject } from './smells/endpoint-based-service-interaction';
import { MultipleServicesInOneContainerSmellObject } from './smells/multiple-services-in-one-container';
import { WobblyServiceInteractionSmellObject } from './smells/wobbly-service-interaction';
import { AddApiGatewayRefactoring } from './refactoring-commands/add-api-gateway-refactoring-command';
import { AddCircuitBreakerRefactoring } from './refactoring-commands/add-circuit-breaker';
import { AddDataManagerRefactoring } from './refactoring-commands/add-data-manager';
import { AddMessageBrokerRefactoring } from './refactoring-commands/add-message-broker';
import { AddMessageRouterRefactoring } from './refactoring-commands/add-message-router';
import { AddServiceDiscoveryRefactoring } from './refactoring-commands/add-service-discovery';
import { ChangeDatastoreOwnershipRefactoring } from './refactoring-commands/change-datastore-ownership';
import { ChangeNodeOwnershipToMostCoupledRefactoring } from './refactoring-commands/change-node-ownership-to-most-coupled-team';
import { ChangeServiceOwnershipRefactoring } from './refactoring-commands/change-service-ownership';
import { MergeServicesRefactoring } from './refactoring-commands/merge-services-refactoring';
import { MergeTeamsRefactoring } from './refactoring-commands/merge-teams';
import { SplitDatastoreRefactoring } from './refactoring-commands/split-database';
import { SplitTeamsSharedDatastoreRefactoring } from './refactoring-commands/split-teams-shared-datastore';
import { UseTimeoutRefactoring } from './refactoring-commands/use-timeout';
import { IgnoreOnceRefactoring, IgnoreAlwaysRefactoring } from './refactoring-commands/ignore-refactoring-commands';
import * as joint from 'jointjs';

@Injectable({
  providedIn: 'root'
})
export class SmellFactoryService {

  constructor(
    private gs: GraphService,
  ) {}

  getSmell(smellJson, element) {
    if(element instanceof joint.shapes.microtosca.Node) {
      return this.getNodeSmell(smellJson, element);
    } else if(element instanceof joint.shapes.microtosca.Group) {
      return this.getGroupSmell(smellJson, element);
    }
  }

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
        break;
    }

    smellJson['links'].forEach((cause) => {
      var source = this.gs.getGraph().findNodeByName(cause['source']);
      var target = this.gs.getGraph().findNodeByName(cause['target']);
      var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
      smell.addLinkBasedCause(link);
      smell.addNodeBasedCause(node)
    });

    smellJson['refactorings'].forEach((refactoringJson) => {
      let refactoringName = refactoringJson['name'];
      let refactorings: Refactoring[] = this.getRefactoring(refactoringName, smell);
      refactorings.forEach((refactoring) => smell.addRefactoring(refactoring));
    });
    this.addIgnoreOptions(node, smell);
    return smell;
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
          break;
      }
      smellJson['nodes'].forEach((node_name) => {
        let node = this.gs.getGraph().findNodeByName(node_name);
        smell.addNodeBasedCause(node);
      });
      
      smellJson['links'].forEach((link_cause) => {
        var source = this.gs.getGraph().findNodeByName(link_cause['source']);
        var target = this.gs.getGraph().findNodeByName(link_cause['target']);
        var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        console.log("source/target", source.getName(), target.getName());
        smell.addLinkBasedCause(link);
      });

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactorings: Refactoring[] = this.getRefactoring(refactoringName, smell);;
        refactorings.forEach(refactoring => smell.addRefactoring(refactoring));
      });
      this.addIgnoreOptions(group, smell);
      return smell;
    }

  private getRefactoring(refactoringName: string, smell: SmellObject): Refactoring[] {
    let refactorings;
    if(smell instanceof GroupSmellObject){
      refactorings = this.getGroupRefactoring(refactoringName, smell);
    } else {
      refactorings = this.getNodeRefactoring(refactoringName, smell);
    }
    return [].concat(refactorings);
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

  private getGroupRefactoring(refactoringName: string, smell: GroupSmellObject): (Refactoring | Refactoring[]) {
    
    switch(refactoringName){

      case REFACTORING_NAMES.REFACTORING_ADD_API_GATEWAY:
        return new AddApiGatewayRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_SPLIT_TEAMS_BY_SERVICE:
        return [
          new ChangeDatastoreOwnershipRefactoring(this.gs.getGraph(), smell),
          new ChangeServiceOwnershipRefactoring(this.gs.getGraph(), smell),
          new SplitTeamsSharedDatastoreRefactoring(this.gs.getGraph(), smell),
          new MergeTeamsRefactoring(this.gs.getGraph(), smell)
        ];
      
      case REFACTORING_NAMES.REFACTORING_SPLIT_TEAMS_BY_COUPLING:
        return [
          new ChangeNodeOwnershipToMostCoupledRefactoring(this.gs.getGraph(), smell),
          new MergeTeamsRefactoring(this.gs.getGraph(), smell)
        ]
    }
  }

  addIgnoreOptions(element, smell) {
    smell.addRefactoring(new IgnoreOnceRefactoring(element, smell));
    smell.addRefactoring(new IgnoreAlwaysRefactoring(element, smell));
  }

}
