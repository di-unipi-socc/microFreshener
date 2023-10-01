import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarEvent } from 'src/app/core/app-menu/sidebar-event';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamsManagementService } from '../teams-management/teams-management.service';

@Component({
  selector: 'app-subtoolbar-from-team-navigation',
  templateUrl: './subtoolbar-from-team-navigation.component.html',
  styleUrls: ['./subtoolbar-from-team-navigation.component.css']
})
export class SubtoolbarFromTeamNavigationComponent {

  showDependencies: boolean;
  showIncomingTeams: boolean;

  public static readonly EVENT_NAME: string = 'insideTeamView';

  //Declare the property
  @Output() viewIncomingTeams: EventEmitter<SidebarEvent> = new EventEmitter();
 
  constructor(
    private session: SessionService,
    private gs: GraphService,
    private teams: TeamsManagementService
  ) {
    this.showDependencies = false;
    this.showIncomingTeams = false;
  }

  toggleViewDependencies() {
    let teamName = this.session.getName();
    if(this.showDependencies) {
      this.teams.showTeamDependencies(teamName);
    } else {
      this.teams.hideTeamDependencies(teamName);
    }
  }

  toggleViewIncomingTeams() {
    let sidebarEvent: SidebarEvent = {
      name: 'viewIncomingTeams',
      visible: this.showIncomingTeams
    }
    this.viewIncomingTeams.emit(sidebarEvent);
  }

}
