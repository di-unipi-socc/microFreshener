import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { AddApiGatewayRefactoring, AddCircuitBreakerRefactoring, AddDataManagerIntoTeamRefactoring, AddDataManagerRefactoring, AddMessageBrokerRefactoring, AddMessageRouterRefactoring, AddServiceDiscoveryRefactoring, MergeServicesRefactoring, MoveDatastoreIntoTeamRefactoring, MoveServiceIntoTeamRefactoring, Refactoring, SplitDatastoreRefactoring, UseTimeoutRefactoring } from './refactoring-command';
import { REFACTORING_NAMES } from './costants';
import { GraphService } from '../graph/graph.service';

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
      
      case REFACTORING_NAMES.REFACTORING_SPLIT_DATABASE:
        return new SplitDatastoreRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_DATA_MANAGER:
        return new AddDataManagerRefactoring(this.gs.getGraph(), smell);
    }
  }

  private getGroupRefactoring(refactoringName: string, smell: GroupSmellObject): Refactoring {
    
    switch(refactoringName){

      case REFACTORING_NAMES.REFACTORING_ADD_API_GATEWAY:
        return new AddApiGatewayRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_CHANGE_DATABASE_OWENRSHIP:
        return new MoveDatastoreIntoTeamRefactoring(this.gs.getGraph(), smell);

        case REFACTORING_NAMES.REFACTORING_CHANGE_SERVICE_OWENRSHIP:
        return new MoveServiceIntoTeamRefactoring(this.gs.getGraph(), smell);

      case REFACTORING_NAMES.REFACTORING_ADD_TEAM_DATA_MANAGER:
        return new AddDataManagerIntoTeamRefactoring(this.gs.getGraph(), smell);

    }
  }
}