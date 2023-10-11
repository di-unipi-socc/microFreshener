import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { TeamsService } from '../teams.service';

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
  @Output() viewIncomingTeams: EventEmitter<{}> = new EventEmitter();
 
  constructor(
    private session: SessionService,
    private teams: TeamsService
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
    let sidebarEvent = {
      name: 'viewIncomingTeams',
      visible: this.showIncomingTeams
    }
    this.viewIncomingTeams.emit(sidebarEvent);
  }

}
