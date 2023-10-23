import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { REFACTORING_NAMES } from './costants';
import { GraphService } from '../graph/graph.service';
import { AddApiGatewayRefactoring, AddCircuitBreakerRefactoring, AddDataManagerRefactoring, AddMessageBrokerRefactoring, AddMessageRouterRefactoring, AddServiceDiscoveryRefactoring, AddTeamDataManagerRefactoring, MergeServicesRefactoring, ChangeDatastoreOwnershipRefactoring, ChangeServiceOwnershipRefactoring, Refactoring, SplitDatastoreRefactoring, UseTimeoutRefactoring } from './refactoring-commands';

@Injectable({
  providedIn: 'root'
})
export class RefactoringFactoryService {

  constructor(
    private gs: GraphService
  ) { }

  getRefactoring(refactoringName: string, smell: SmellObject): Refactoring {
    if(smell instanceof GroupSmellObject){
      return this.getGroupRefactoring(refactoringName, smell);
    } else {
      return this.getNodeRefactoring(refactoringName, smell);
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

  private getGroupRefactoring(refactoringName: string, smell: GroupSmellObject): Refactoring {
    
    switch(refactoringName){

      case REFACTORING_NAMES.REFACTORING_ADD_API_GATEWAY:
        return new AddApiGatewayRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_CHANGE_DATASTORE_OWENRSHIP:
        return new ChangeDatastoreOwnershipRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_CHANGE_SERVICE_OWENRSHIP:
        return new ChangeServiceOwnershipRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_ADD_TEAM_DATA_MANAGER:
        return new AddTeamDataManagerRefactoring(this.gs.getGraph(), smell);

    }
  }
}