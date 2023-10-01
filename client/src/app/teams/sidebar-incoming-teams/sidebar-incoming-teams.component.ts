import { Component } from '@angular/core';
import { TeamsManagementService } from '../teams.service';
import { SessionService } from 'src/app/core/session/session.service';
import { UserRole } from 'src/app/core/user-role';
import { GraphService } from 'src/app/graph/graph.service';
import { Subscription } from 'rxjs';
import * as joint from 'jointjs';

@Component({
  selector: 'app-sidebar-incoming-teams',
  templateUrl: './sidebar-incoming-teams.component.html',
  styleUrls: ['./sidebar-incoming-teams.component.css']
})
export class SidebarIncomingTeamsComponent {

  groups: Array<{
    group: joint.shapes.microtosca.Group,
    recipients: joint.shapes.microtosca.Node[]
  }>;

  subscription: Subscription;

  constructor(
    private session: SessionService,
    private teams: TeamsManagementService,
    private gs: GraphService
  ) {}

  ngOnInit() {
    // Get the groups and relative interacting nodes
    this.updateIngoingRequestGroups();
    // Refresh at every graph update
    this.subscription = this.gs.getUpdates().subscribe({
      next: (evt) => { this.updateIngoingRequestGroups() },
      error: (evt) => { console.error("update error") },
      complete: () => {}
    });
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
    else
      console.log("subscription undefined")
  }

  updateIngoingRequestGroups() {
    // Defined only for Team users
    if(this.session.getRole() == UserRole.TEAM) {
      let teamName = this.session.getName();
      // Get the groups that use the team's nodes and sort (edge first, then by number of recipients descending)
      let groupsMap = this.teams.getIngoingRequestSenderGroups(teamName);
      this.groups = Array.from(groupsMap,
        ([group, recipients]) => ({ group: group, recipients: recipients}))
        .sort((g1, g2) => {
          if(g1.group && g1.group instanceof joint.shapes.microtosca.EdgeGroup) return -1;
          if(g1.recipients.length >= g2.recipients.length) return -1;
        });
    }
  }

  getSeverity(group: joint.shapes.microtosca.Group) {
    if(!group) return "warning"; // Unassigned nodes
    if(group instanceof joint.shapes.microtosca.EdgeGroup) return "success";
    else return "primary";
  }

  getUIGroupName(group: joint.shapes.microtosca.Group) {
    if(!group) return "Unassigned nodes";
    if(group instanceof joint.shapes.microtosca.EdgeGroup) return "External users";
    return group.getName();
  }

}
