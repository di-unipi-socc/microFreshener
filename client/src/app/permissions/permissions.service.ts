import { Injectable } from '@angular/core';
import { UserRole } from 'src/app/core/user-role';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private readonly ALLOW_ALL = (...any: any[]) => { return true; }
  private readonly DENY_ALL = (...any: any[]) => { return false; }
  private readonly DENY_ALL_TWO_NODES = (n1, n2?) => { return false; }

  public writePermissions = {
    isAllowed: this.DENY_ALL,
    isTeamManagementAllowed: this.DENY_ALL,
    areLinkable: this.DENY_ALL_TWO_NODES
  };

  constructor(
    private gs: GraphService
  ) {}

  updatePermissions(role: UserRole, teamName?: string) {
    switch(role) {
        case UserRole.ADMIN:
            console.warn("ADMIN privileges have been set.");
            // Admin can write everything
            this.writePermissions.isAllowed = this.ALLOW_ALL;
            this.writePermissions.areLinkable = this.ALLOW_ALL;
            this.writePermissions.isTeamManagementAllowed = this.ALLOW_ALL;
            break;
        case UserRole.TEAM:
            console.info("TEAM privileges have been set.");
            let team = this.gs.getGraph().findTeamByName(teamName);
            if(!team) {
              // The team doesn't exist in the graph, so block everything
              this.writePermissions.isAllowed = this.DENY_ALL;
              this.writePermissions.areLinkable = this.DENY_ALL;
              this.writePermissions.isTeamManagementAllowed = this.ALLOW_ALL;
            } else {
              // The team exists, so set the consequent permissions
              this.writePermissions.isAllowed = ( (cell) => {
                let sourceTeam;
                if(this.gs.getGraph().isNode(cell)) {
                  sourceTeam = this.gs.getGraph().getTeamOfNode(cell);
                } else if(cell.isLink()) {
                  sourceTeam = this.gs.getGraph().getTeamOfNode(cell.getSourceElement());
                }
                return sourceTeam && sourceTeam == team;
              } );
              this.writePermissions.areLinkable = (n: joint.shapes.microtosca.Node, n2?: joint.shapes.microtosca.Node): boolean => {
                return this.writePermissions.isAllowed(n)
                        && !this.gs.getGraph().isDatastore(n)
                        && !this.gs.getGraph().isMessageBroker(n);
              };
              this.writePermissions.isTeamManagementAllowed = this.DENY_ALL;
            }
            break;
          default:
            this.writePermissions.isAllowed = this.DENY_ALL;
            this.writePermissions.areLinkable = this.DENY_ALL;
            this.writePermissions.isTeamManagementAllowed = this.DENY_ALL;
      }
  }

}
