import { Injectable } from '@angular/core';
import { NodeSmell, GroupSmell } from '../smells/smell';
import { AddApiGatewayRefactoring } from './add-api-gateway';
import { AddCircuitBreakerRefactoring } from './add-circuit-breaker';
import { AddDataManagerRefactoring } from './add-data-manager';
import { AddMessageBrokerRefactoring } from './add-message-broker';
import { AddMessageRouterRefactoring } from './add-message-router';
import { AddServiceDiscoveryRefactoring } from './add-service-discovery';
import { MergeServicesRefactoring, MergeServicesTeamPolicy } from './merge-services';
import { Refactoring, RefactoringBuilder } from './refactoring-command';
import { SplitDatastoreRefactoring } from './split-datastore';
import { SplitTeamsByCouplingRefactoring } from './split-teams-by-coupling';
import { SplitTeamsByService as SplitTeamsByServiceRefactoring } from './split-teams-by-service';
import { UseTimeoutRefactoring } from './use-timeout';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/graph/graph.service';
import { MergeTeamsRefactoring } from './merge-teams';
import { SplitDatastoreAmongTeamsRefactoring } from './split-datastore-among-teams';
import { NotAllowedRefactoring, RefactoringPolicy } from './refactoring-policy';

enum REFACTORING_LIBRARY_NAMES {
  REFACTORING_ADD_SERVICE_DISCOVERY = 'Add-service-discovery',
  REFACTORING_ADD_MESSAGE_ROUTER = 'Add-message-router',
  REFACTORING_ADD_MESSAGE_BROKER = 'Add-message-broker',
  REFACTORING_ADD_CIRCUIT_BREAKER = 'Add-circuit-breaker',
  REFACTORING_USE_TIMEOUT = "Use-timeout",
  REFACTORING_MERGE_SERVICES = "Merge-service",
  REFACTORING_SPLIT_DATASTORE = "Split-Datastore",
  REFACTORING_ADD_DATA_MANAGER = "Add-data-manager",
  REFACTORING_ADD_API_GATEWAY = "Add-api-gateway",
  REFACTORING_SPLIT_TEAMS_BY_SERVICE = "Split-teams-by-service",
  REFACTORING_SPLIT_TEAMS_BY_COUPLING = "Split-teams-by-coupling",
  REFACTORING_MERGE_TEAMS = "Merge-teams"
}

@Injectable({
  providedIn: 'root'
})
export class RefactoringFactoryService {

  constructor(
    private gs: GraphService,
    private session: SessionService
  ) {}

  getRefactoring(refactoringName: string, smell: (NodeSmell | GroupSmell)): Refactoring {
    if(smell instanceof NodeSmell) {
      let team;
      if(this.session.isTeam()) {
        team = this.gs.graph.findTeamByName(this.session.getTeamName());
      }
      return this.getNodeSmellRefactoring(refactoringName, smell, team);
    } else if(smell instanceof GroupSmell && this.session.isAdmin()) {
      return this.getGroupSmellRefactoring(refactoringName, smell);
    }
  }

  private getNodeSmellRefactoring(refactoringName: string, smell: NodeSmell, team?: joint.shapes.microtosca.SquadGroup): Refactoring {

    let policy: RefactoringPolicy;
    let refactoringBuilder: RefactoringBuilder;

    switch (refactoringName) {

      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_MESSAGE_ROUTER:
        return new AddMessageRouterRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_MESSAGE_BROKER:
        return new AddMessageBrokerRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_SERVICE_DISCOVERY:
        return new AddServiceDiscoveryRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_CIRCUIT_BREAKER:
        return new AddCircuitBreakerRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_USE_TIMEOUT:
        return new UseTimeoutRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_MERGE_SERVICES:
        policy = new MergeServicesTeamPolicy(this.gs.graph, smell, team);
        refactoringBuilder = MergeServicesRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_SPLIT_DATASTORE:
        return new SplitDatastoreRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_DATA_MANAGER:
        return new AddDataManagerRefactoring(this.gs.graph, smell);
    }

    if(!policy || !refactoringBuilder) {
      throw new Error("Refactoring not supported");
    }

    if(!policy.isAllowed()) {
      return new NotAllowedRefactoring(policy);
    }

    refactoringBuilder.setGraph(this.gs.graph).setSmell(smell);
    if(this.session.isTeam()) {
      refactoringBuilder.setTeam(team);
    }
    return refactoringBuilder.build();

  }

  private getGroupSmellRefactoring(refactoringName: string, smell: GroupSmell): Refactoring {
    
    let refactoringBuilder;

    switch(refactoringName){

      case REFACTORING_LIBRARY_NAMES.REFACTORING_ADD_API_GATEWAY:
        refactoringBuilder = AddApiGatewayRefactoring.builder();
        break;

      case REFACTORING_LIBRARY_NAMES.REFACTORING_SPLIT_TEAMS_BY_SERVICE:
        return new SplitTeamsByServiceRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.REFACTORING_SPLIT_TEAMS_BY_COUPLING:
        return new SplitTeamsByCouplingRefactoring(this.gs.graph, smell);

      case REFACTORING_LIBRARY_NAMES.REFACTORING_SPLIT_DATASTORE:
        return new SplitDatastoreAmongTeamsRefactoring(this.gs.graph, smell);

      case REFACTORING_LIBRARY_NAMES.REFACTORING_MERGE_TEAMS:
        return new MergeTeamsRefactoring(this.gs.graph, smell);
    }
  }
}
