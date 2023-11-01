import { Injectable } from '@angular/core';
import { NodeGeneratorCommand } from 'src/app/architecture/node-commands';
import { Command } from 'src/app/commands/icommand';
import { AddMemberToTeamGroupCommand } from 'src/app/teams/team-commands';
import { SmellObject, GroupSmellObject } from '../smells/smell';
import { AddApiGatewayRefactoring } from './add-api-gateway-refactoring-command';
import { AddCircuitBreakerRefactoring } from './add-circuit-breaker';
import { AddDataManagerRefactoring } from './add-data-manager';
import { AddMessageBrokerRefactoring } from './add-message-broker';
import { AddMessageRouterRefactoring } from './add-message-router';
import { AddServiceDiscoveryRefactoring } from './add-service-discovery';
import { MergeServicesRefactoring } from './merge-services-refactoring';
import { Refactoring, GroupRefactoring } from './refactoring-command';
import { SplitDatastoreRefactoring } from './split-datastore';
import { SplitTeamsByCouplingRefactoring } from './split-teams-by-coupling';
import { SplitTeamsByService as SplitTeamsByServiceRefactoring } from './split-teams-by-service';
import { UseTimeoutRefactoring } from './use-timeout';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/graph/graph.service';

enum REFACTORING_NAMES {
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
  REFACTORING_SPLIT_TEAMS_BY_COUPLING = "Split-teams-by-coupling"
}

@Injectable({
  providedIn: 'root'
})
export class RefactoringFactoryService {

  constructor(
    private gs: GraphService,
    private session: SessionService,
  ) {}

  getNodeRefactoring(refactoringName: string, smell: SmellObject): Refactoring {

    switch (refactoringName) {

      case REFACTORING_NAMES.REFACTORING_ADD_MESSAGE_ROUTER:
        return this.restrictToTeamIfAny(new AddMessageRouterRefactoring(this.gs.getGraph(), smell));
      
      case REFACTORING_NAMES.REFACTORING_ADD_MESSAGE_BROKER:
        return this.restrictToTeamIfAny(new AddMessageBrokerRefactoring(this.gs.getGraph(), smell));
      
      case REFACTORING_NAMES.REFACTORING_ADD_SERVICE_DISCOVERY:
        return new AddServiceDiscoveryRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_ADD_CIRCUIT_BREAKER:
        return new AddCircuitBreakerRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_USE_TIMEOUT:
        return new UseTimeoutRefactoring(this.gs.getGraph(), smell);
      
      case REFACTORING_NAMES.REFACTORING_MERGE_SERVICES:
        return this.restrictToTeamIfAny(new MergeServicesRefactoring(this.gs.getGraph(), smell));
      
      case REFACTORING_NAMES.REFACTORING_SPLIT_DATASTORE:
        return this.restrictToTeamIfAny(new SplitDatastoreRefactoring(this.gs.getGraph(), smell));
      
      case REFACTORING_NAMES.REFACTORING_ADD_DATA_MANAGER:
        return this.restrictToTeamIfAny(new AddDataManagerRefactoring(this.gs.getGraph(), smell));
    }

  }

  private restrictToTeamIfAny(refactoring: AddMessageRouterRefactoring | AddMessageBrokerRefactoring | MergeServicesRefactoring | SplitDatastoreRefactoring | AddDataManagerRefactoring) {
    let team = this.session.isTeam() ? this.gs.getGraph().findTeamByName(this.session.getName()) : undefined;
    if(team) {
      refactoring.cmd.map((cmd: Command) => {
        if(cmd instanceof NodeGeneratorCommand) {
          cmd.bind(new AddMemberToTeamGroupCommand(team));
        }
        return cmd;
      });
    }
    return refactoring;
  }

  getGroupRefactoring(refactoringName: string, smell: GroupSmellObject): GroupRefactoring {
    
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
