import { Injectable } from '@angular/core';
import { NodeSmell, GroupSmell } from '../smells/smell';
import { AddApiGatewayRefactoring } from './add-api-gateway';
import { AddCircuitBreakerRefactoring } from './add-circuit-breaker';
import { AddDataManagerRefactoring } from './add-data-manager';
import { AddMessageBrokerRefactoring } from './add-message-broker';
import { AddMessageRouterRefactoring } from './add-message-router';
import { AddServiceDiscoveryRefactoring } from './add-service-discovery';
import { MergeServicesRefactoring } from './merge-services';
import { Refactoring, RefactoringBuilder } from './refactoring-command';
import { SplitDatastoreRefactoring } from './split-datastore';
import { SplitTeamsByCouplingRefactoring } from './split-teams-by-coupling';
import { SplitTeamsByService as SplitTeamsByServiceRefactoring } from './split-teams-by-service';
import { UseTimeoutRefactoring } from './use-timeout';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/graph/graph.service';
import { MergeTeamsRefactoring } from './merge-teams';
import { SplitDatastoreAmongTeamsRefactoring } from './split-datastore-among-teams';
import { NotAllowedRefactoring, NeverAllowedRefactoringPolicy, RefactoringPolicy, AlwaysAllowedRefactoringPolicy } from './refactoring-policy';
import { AnyInteractionFromTeamPolicy, SomeTeamInternalInteractionPolicy, SomeInteractionsFromTeamPolicy, AnyTeamInternalInteractionPolicy } from './refactoring-policy-teams';

enum REFACTORING_LIBRARY_NAMES {
  ADD_SERVICE_DISCOVERY = 'Add-service-discovery',
  ADD_MESSAGE_ROUTER = 'Add-message-router',
  ADD_MESSAGE_BROKER = 'Add-message-broker',
  ADD_CIRCUIT_BREAKER = 'Add-circuit-breaker',
  USE_TIMEOUT = "Use-timeout",
  MERGE_SERVICES = "Merge-service",
  SPLIT_DATASTORE = "Split-Datastore",
  ADD_DATA_MANAGER = "Add-data-manager",
  ADD_API_GATEWAY = "Add-api-gateway",
  SPLIT_TEAMS_BY_SERVICE = "Split-teams-by-service",
  SPLIT_TEAMS_BY_COUPLING = "Split-teams-by-coupling",
  MERGE_TEAMS = "Merge-teams"
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
    let team;
    if(this.session.isTeam()) {
      team = this.gs.graph.findTeamByName(this.session.getTeamName());
    }

    if(smell instanceof NodeSmell) {
      return this.getNodeSmellRefactoring(refactoringName, smell, team);
    } else if(smell instanceof GroupSmell) {
      return this.getGroupSmellRefactoring(refactoringName, smell, team);
    }
  }

  private getNodeSmellRefactoring(refactoringName: string, smell: NodeSmell, team?: joint.shapes.microtosca.SquadGroup): Refactoring {

    let policy: RefactoringPolicy;
    let refactoringBuilder: RefactoringBuilder;

    if(this.session.isAdmin())
      policy = new AlwaysAllowedRefactoringPolicy();

    switch (refactoringName) {

      case REFACTORING_LIBRARY_NAMES.ADD_MESSAGE_ROUTER:
        if(team)
          policy = new AnyInteractionFromTeamPolicy(team, AddMessageRouterRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = AddMessageRouterRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.ADD_MESSAGE_BROKER:
        if(team)
          policy = new AnyTeamInternalInteractionPolicy(team, AddMessageBrokerRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = AddMessageBrokerRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.ADD_SERVICE_DISCOVERY:
        if(team)
          policy = new AnyInteractionFromTeamPolicy(team, AddServiceDiscoveryRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = AddServiceDiscoveryRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.ADD_CIRCUIT_BREAKER:
        if(team)
          policy = new AnyInteractionFromTeamPolicy(team, AddCircuitBreakerRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = AddCircuitBreakerRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.USE_TIMEOUT:
        if(team)
          policy = new AnyInteractionFromTeamPolicy(team, UseTimeoutRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = UseTimeoutRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.MERGE_SERVICES:
        if(team)
          policy = new SomeInteractionsFromTeamPolicy(2, team, MergeServicesRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = MergeServicesRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.SPLIT_DATASTORE:
        if(team)
          policy = new AnyTeamInternalInteractionPolicy(team, SplitDatastoreRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = SplitDatastoreRefactoring.builder();
        break;
      
      case REFACTORING_LIBRARY_NAMES.ADD_DATA_MANAGER:
        if(team)
          policy = new SomeInteractionsFromTeamPolicy(2, team, AddDataManagerRefactoring.NAME, this.gs.graph, smell);
        refactoringBuilder = AddDataManagerRefactoring.builder();
    }

    if(!policy || !refactoringBuilder) {
      throw new Error("Refactoring not supported");
    }

    if(!policy.isAllowed()) {
      return new NotAllowedRefactoring(policy);
    }

    refactoringBuilder.setGraph(this.gs.graph).setSmell(smell);
    if(team) {
      refactoringBuilder.setTeam(team);
    }
    return refactoringBuilder.build();

  }

  private getGroupSmellRefactoring(refactoringName: string, smell: GroupSmell, team?: joint.shapes.microtosca.SquadGroup): Refactoring {

    switch(refactoringName){

      case REFACTORING_LIBRARY_NAMES.ADD_API_GATEWAY:
        return AddApiGatewayRefactoring.builder()
                                        .setGraph(this.gs.graph)
                                        .setSmell(smell)
                                        .setTeam(team)
                                        .build();
      default:
        return this.getTeamSmellRefactoring(refactoringName, smell);
    }
  }

  private getTeamSmellRefactoring(refactoringName: string, smell: GroupSmell): Refactoring {

    if(!this.session.isAdmin()) {
      return new NotAllowedRefactoring(new NeverAllowedRefactoringPolicy(refactoringName, "Only admins can manage teams."));
    }

    switch(refactoringName) {
      case REFACTORING_LIBRARY_NAMES.SPLIT_TEAMS_BY_SERVICE:
        return new SplitTeamsByServiceRefactoring(this.gs.graph, smell);
      
      case REFACTORING_LIBRARY_NAMES.SPLIT_TEAMS_BY_COUPLING:
        return new SplitTeamsByCouplingRefactoring(this.gs.graph, smell);

      case REFACTORING_LIBRARY_NAMES.SPLIT_DATASTORE:
        return new SplitDatastoreAmongTeamsRefactoring(this.gs.graph, smell);

      case REFACTORING_LIBRARY_NAMES.MERGE_TEAMS:
        return new MergeTeamsRefactoring(this.gs.graph, smell);
    }
  }
}
