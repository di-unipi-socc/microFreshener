import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { REFACTORING_NAMES } from './costants';
import { GraphService } from '../graph/graph.service';
import { AddApiGatewayRefactoring, AddCircuitBreakerRefactoring, AddDataManagerRefactoring, AddMessageBrokerRefactoring, AddMessageRouterRefactoring, AddServiceDiscoveryRefactoring, SplitTeamsSharedDatastoreRefactoring, MergeServicesRefactoring, ChangeDatastoreOwnershipRefactoring, ChangeServiceOwnershipRefactoring, Refactoring, SplitDatastoreRefactoring, UseTimeoutRefactoring, MergeTeamsRefactoring, ChangeNodeOwnershipToMostCoupledRefactoring } from './refactoring-commands';

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