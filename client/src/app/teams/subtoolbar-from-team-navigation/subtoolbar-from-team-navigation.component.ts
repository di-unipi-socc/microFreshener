import { Component, EventEmitter, Output } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { TeamsService } from '../teams.service';
import { GraphService } from 'src/app/graph/graph.service';

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
    private teams: TeamsService,
    private graphService: GraphService
  ) {
    this.showDependencies = false;
    this.showIncomingTeams = false;
  }

  toggleViewDependencies() {
    let teamName = this.session.getName();
    let graph = this.graphService.getGraph();
    let team = graph.findTeamByName(teamName);
    if(this.showDependencies) {
      this.teams.showTeamDependencies(team);
    } else {
      this.teams.hideTeamDependencies(team);
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
