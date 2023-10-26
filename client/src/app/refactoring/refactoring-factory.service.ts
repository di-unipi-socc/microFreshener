import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { REFACTORING_NAMES } from './costants';
import { GraphService } from '../graph/graph.service';
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
import { Refactoring } from './refactoring-commands/refactoring-command';
import { SplitDatastoreRefactoring } from './refactoring-commands/split-database';
import { SplitTeamsSharedDatastoreRefactoring } from './refactoring-commands/split-teams-shared-datastore';
import { UseTimeoutRefactoring } from './refactoring-commands/use-timeout';

@Injectable({
  providedIn: 'root'
})
export class RefactoringFactoryService {

  constructor(
    private gs: GraphService
  ) { }

  getRefactoring(refactoringName: string, smell: SmellObject): Refactoring[] {
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
}