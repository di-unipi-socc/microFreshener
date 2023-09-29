import { Component } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamsManagementService } from '../teams-management/teams-management.service';
import { SessionService } from 'src/app/core/session/session.service';
import { UserRole } from 'src/app/core/user-role';

@Component({
  selector: 'app-sidebar-incoming-teams',
  templateUrl: './sidebar-incoming-teams.component.html',
  styleUrls: ['./sidebar-incoming-teams.component.css']
})
export class SidebarIncomingTeamsComponent {

  constructor(
    private session: SessionService,
    private gs: GraphService,
    private teams: TeamsManagementService
  ) { }

  ngOnInit() {
    if(this.session.getRole() == UserRole.TEAM) {
      let teamName = this.session.getName();
      let groups = this.teams.getIngoingRequestSenderGroups(teamName);
      console.log(groups);
    }
  }

}
