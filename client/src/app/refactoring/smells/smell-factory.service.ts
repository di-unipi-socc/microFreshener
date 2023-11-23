import { Injectable } from '@angular/core';
import { GroupSmellObject, SmellObject } from './smell';
import { GraphService } from '../../graph/graph.service';
import { SharedPersistencySmellObject } from './shared-persistency';
import { NoApiGatewaySmellObject } from './no-api-gateway';
import { SingleLayerTeamsSmellObject } from './single-layer-teams';
import { TightlyCoupledTeamsSmellObject } from './tightly-coupled-teams';
import { SharedBoundedContextSmellObject } from './shared-bounded-context';
import { GroupRefactoring, Refactoring } from '../refactorings/refactoring-command';
import { EndpointBasedServiceInteractionSmellObject } from './endpoint-based-service-interaction';
import { MultipleServicesInOneContainerSmellObject } from './multiple-services-in-one-container';
import { WobblyServiceInteractionSmellObject } from './wobbly-service-interaction';
import { IgnoreOnceRefactoring, IgnoreAlwaysRefactoring } from '../refactorings/ignore-refactoring-commands';
import * as joint from 'jointjs';
import { SessionService } from '../../core/session/session.service';
import { RefactoringFactoryService } from '../refactorings/refactoring-factory.service';

enum SMELL_NAMES {
  SMELL_ENDPOINT_BASED_SERVICE_INTERACTION = "Endpoint-based-service-interaction",
  SMELL_WOBBLY_SERVICE_INTERACTION_SMELL = "Wobbly-service-interaction",
  SMELL_SHARED_PERSISTENCY = "Shared-persistency",
  SMELL_NO_API_GATEWAY = "No-api-gateway",
  SMELL_SINGLE_LAYER_TEAMS = "Single-layer-teams",
  SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER = "Multiple-services-in-one-container",
  SMELL_TIGHTLY_COUPLED_TEAMS = "Tightly-coupled-teams",
  SMELL_SHARED_BOUNDED_CONTEXT = "Shared-bounded-context"
}

@Injectable({
  providedIn: 'root'
})
export class SmellFactoryService {

  constructor(
    private gs: GraphService,
    private refactoring: RefactoringFactoryService,
    private session: SessionService
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

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactoring: Refactoring = this.refactoring.getRefactoring(refactoringName, smell);
        if(refactoring)
          smell.addRefactoring(refactoring);
      });

      smell.addRefactoring(new IgnoreOnceRefactoring(node, smell));
      smell.addRefactoring(new IgnoreAlwaysRefactoring(node, smell));
      return smell;
    }
  }

  getGroupSmell(smellJson, group): GroupSmellObject {
    console.debug("Getting smell for", smellJson.name);
    if(!this.session.isAdmin) return;
    
    let smell: GroupSmellObject;
    switch (smellJson.name) {
      case SMELL_NAMES.SMELL_NO_API_GATEWAY:
        smell = new NoApiGatewaySmellObject(<joint.shapes.microtosca.EdgeGroup> group);
        break;
      case SMELL_NAMES.SMELL_SINGLE_LAYER_TEAMS:
        smell = new SingleLayerTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      case SMELL_NAMES.SMELL_TIGHTLY_COUPLED_TEAMS:
        smell = new TightlyCoupledTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
        break;
      case SMELL_NAMES.SMELL_SHARED_BOUNDED_CONTEXT:
        smell = new SharedBoundedContextSmellObject(<joint.shapes.microtosca.SquadGroup> group);
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

      let subSmells = new Map<joint.shapes.microtosca.Node, SmellObject>();
      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactoring: GroupRefactoring = <GroupRefactoring> this.refactoring.getRefactoring(refactoringName, smell);
        smell.addRefactoring(refactoring);
        // Add partial member refactoring to members' smells
        let membersRefactorings = refactoring.getMemberRefactorings();
        membersRefactorings?.forEach((refactorings, member) => {
            let memberSmell = subSmells.get(member);
            if(!memberSmell) {
                memberSmell = new SmellObject(`${smell.getName()} in ${smell.getGroup().getName()}`, smell.getGroup());
                subSmells.set(member, memberSmell);
            }
            console.debug("refactorings", refactorings.map((r) => r.getName()));
            refactorings.forEach((r) => memberSmell.addRefactoring(r));
        });
      });
      smell.setSubSmells(subSmells);

      // Add ignore operations to smell and its subsmells
      smell.addRefactoring(new IgnoreOnceRefactoring(group, smell));
      smell.addRefactoring(new IgnoreAlwaysRefactoring(group, smell));
      subSmells.forEach((subSmell, member) => {
        subSmell.addRefactoring(new IgnoreOnceRefactoring(member, smell));
        subSmell.addRefactoring(new IgnoreAlwaysRefactoring(member, smell));
      });
      
      return smell;
    }
  }

}
