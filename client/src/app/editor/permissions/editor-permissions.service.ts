import { Injectable } from '@angular/core';
import { UserRole } from 'src/app/core/user-role';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class EditorPermissionsService {

  private readonly ALLOW_ALL = (...any: any[]) => { return true; }
  private readonly DENY_ALL = (...any: any[]) => { return false; }

  public enabledActions = {
    addNodeEnabled: false,
    addLinkEnabled: false,
  };

  public writePermissions = {
    isAllowed: this.DENY_ALL,
    isTeamWriteAllowed: this.DENY_ALL,
    linkable: (n1, n2?) => { return false }
  };

  constructor(
    private gs: GraphService
  ) {}

  updatePermissions(role: UserRole, teamName?: string) {
    this.updateWritePermission(role, teamName);
    this.updateTeamWritePermission(role);
  }

  updateWritePermission(role: UserRole, teamName?: string) {
    switch(role) {
        case UserRole.ADMIN:
            // Admin can write everything
            this.writePermissions.isAllowed = this.ALLOW_ALL;
            break;
        case UserRole.TEAM:
            let team = this.gs.getGraph().findGroupByName(teamName);
            if(!team) {
              // The team doesn't exist in the graph, so block everything
              this.writePermissions.isAllowed = (...any: any[]): boolean => { return false; }
            } else {
              // The team exists, so set the consequent permissions
              this.writePermissions.isAllowed = ( (cell) => (this.isEditingAllowedForATeam(team, cell)) );
              
              this.writePermissions.linkable = (n: joint.shapes.microtosca.Node, n2?: joint.shapes.microtosca.Node): boolean => {
                return this.gs.getGraph().getTeamOfNode(n) == team && (n2 ? this.gs.getGraph().getTeamOfNode(n2) == team : true);
              };
            }
            break;
          default:
            this.writePermissions.isAllowed = this.DENY_ALL;
      }
  }

  updateTeamWritePermission(role: UserRole) {
    switch(role) {
      case UserRole.ADMIN:
        this.writePermissions.isTeamWriteAllowed = this.ALLOW_ALL;
        break;
      case UserRole.TEAM:
        this.writePermissions.isTeamWriteAllowed = this.DENY_ALL;
        break;
    }
  }

  isEditingAllowedForATeam(team, cell): boolean {
    
    let outgoingLinks = this.gs.getGraph().getOutgoingLinksOfATeamFrontier(team);
    let nodesLinkedToFrontier = outgoingLinks.map((link) => { return link.getSourceElement(); });
    
    if(cell.isLink()) {
      // Check that the links the user is adding doesn't involve other teams' nodes
      let source = cell.getSourceElement();
      let sourceTeam = this.gs.getGraph().getTeamOfNode(source);
      if(!sourceTeam || sourceTeam != team) {
        return false;
      }
      let target = cell.getTargetElement();
      let targetTeam = this.gs.getGraph().getTeamOfNode(target);
      if(!targetTeam || targetTeam != team) {
        return false;
      }
    } else {
      let nodeTeam = this.gs.getGraph().getTeamOfNode(cell);
      // Check that the node belongs to the team and that it is not linked to the frontier
      if(nodeTeam != team || nodesLinkedToFrontier.includes(cell)) {
        return false;
      }
    }

    return true;
  }

  enableAddNode(isActive: boolean) {
    this.enabledActions.addNodeEnabled = isActive;
  }

  isAddNodeEnabled(cell?): boolean {
    return this.enabledActions.addNodeEnabled && (cell ? this.writePermissions.isAllowed(cell) : true);
  }

  enableAddLink(isActive: boolean) {
      this.enabledActions.addLinkEnabled = isActive;
  }

  isAddLinkEnabled(source?, target?): boolean {
    return this.enabledActions.addLinkEnabled;
  }

}
