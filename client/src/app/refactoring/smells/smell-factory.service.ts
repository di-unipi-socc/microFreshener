import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { GraphService } from '../../graph/graph.service';
import { SharedPersistencySmellObject } from './shared-persistency';
import { NoApiGatewaySmellObject } from './no-api-gateway';
import { SingleLayerTeamsSmellObject } from './single-layer-teams';
import { TightlyCoupledTeamsSmell } from './tightly-coupled-teams';
import { GroupRefactoring, Refactoring } from '../refactorings/refactoring-command';
import { EndpointBasedServiceInteractionSmellObject } from './endpoint-based-service-interaction';
import { MultipleServicesInOneContainerSmellObject } from './multiple-services-in-one-container';
import { WobblyServiceInteractionSmellObject } from './wobbly-service-interaction';
import { IgnoreOnceRefactoring, IgnoreAlwaysRefactoring } from '../refactorings/ignore-refactoring-commands';
import * as joint from 'jointjs';
import { EditorPermissionsService as PermissionsService } from '../../core/permissions/editor-permissions.service';
import { SessionService } from '../../core/session/session.service';
import { RefactoringFactoryService } from '../refactorings/refactoring-factory.service';

enum SMELL_NAMES {
  SMELL_ENDPOINT_BASED_SERVICE_INTERACTION = "Endpoint-based-service-interaction",
  SMELL_WOBBLY_SERVICE_INTERACTION_SMELL = "Wobbly-service-interaction",
  SMELL_SHARED_PERSISTENCY = "Shared-persistency",
  SMELL_NO_API_GATEWAY = "No-api-gateway",
  SMELL_SINGLE_LAYER_TEAMS = "Single-layer-teams",
  SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER = "Multiple-services-in-one-container",
  SMELL_TIGHTLY_COUPLED_TEAMS = "Tightly-coupled-teams"
}

@Injectable({
  providedIn: 'root'
})
export class SmellFactoryService {

  constructor(
    private gs: GraphService,
    private refactoring: RefactoringFactoryService,
    private session: SessionService,
    private permissions: PermissionsService
  ) {}

  getNodeSmell(smellJson, node): SmellObject {
    let smell: SmellObject;
    let isAdmin: boolean = this.session.isAdmin();

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
        smell.addNodeBasedCause(node);
      });

      if(!isAdmin)
        this.filterSmellCauses(smell);

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactoring: Refactoring = this.refactoring.getNodeRefactoring(refactoringName, smell);
        if(refactoring)
          smell.addRefactoring(refactoring);
      });

      smell.addRefactoring(new IgnoreOnceRefactoring(node, smell));
      smell.addRefactoring(new IgnoreAlwaysRefactoring(node, smell));
      return smell;
    }
  }

  private filterSmellCauses(smell: SmellObject) {
    if(this.session.isTeam) {
      let team: joint.shapes.microtosca.SquadGroup = this.gs.getGraph().findTeamByName(this.session.getName());
      smell.nodesCause = smell.nodesCause.filter((node) => this.permissions.isEditingAllowed(team, node));
      smell.linksCause = smell.linksCause.filter((link) => this.permissions.isEditingAllowed(team, link));
    }
  }

  getGroupSmell(smellJson, group): GroupSmellObject {
    if(this.session.isAdmin) {
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
          let refactoring: GroupRefactoring = this.refactoring.getGroupRefactoring(refactoringName, smell);
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
  }

}
