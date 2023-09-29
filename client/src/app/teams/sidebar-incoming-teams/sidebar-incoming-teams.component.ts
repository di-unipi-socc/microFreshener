import { Component } from '@angular/core';
import { TeamsManagementService } from '../teams-management/teams-management.service';
import { SessionService } from 'src/app/core/session/session.service';
import { UserRole } from 'src/app/core/user-role';
import { GraphService } from 'src/app/graph/graph.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-incoming-teams',
  templateUrl: './sidebar-incoming-teams.component.html',
  styleUrls: ['./sidebar-incoming-teams.component.css']
})
export class SidebarIncomingTeamsComponent {

  groups: Array<{ groupName: string, recipients: string[] }>;
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
      next: (evt) => { console.log("update!", evt); this.updateIngoingRequestGroups(); },
      error: (evt) => { console.error("update error") },
      complete: () => { console.log("completing...") }
    });
    console.log(this.subscription);
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
    else
      console.log("subscription undefined")
  }

  updateIngoingRequestGroups() {
    if(this.session.getRole() == UserRole.TEAM) {
      let teamName = this.session.getName();
      let groupsMap = this.teams.getIngoingRequestSenderGroups(teamName);
      this.groups = Array.from(groupsMap, ([group, recipients]) => ( { groupName: group.getName(), recipients: recipients.map((r) => r.getName()) } ));
    }
  }

}
