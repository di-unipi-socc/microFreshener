import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarEvent } from 'src/app/core/app-menu/sidebar-event';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-subtoolbar-inside-team-view',
  templateUrl: './subtoolbar-inside-team-view.component.html',
  styleUrls: ['./subtoolbar-inside-team-view.component.css']
})
export class SubtoolbarInsideTeamViewComponent {

  showDependencies: boolean;
  showIncomingTeams: boolean;

  public static readonly EVENT_NAME: string = 'insideTeamView';

  //Declare the property
  @Output() viewIncomingTeams: EventEmitter<SidebarEvent> = new EventEmitter();
 
  constructor(
    private session: SessionService,
    private gs: GraphService
  ) {
    this.showDependencies = false;
    this.showIncomingTeams = false;
  }

  toggleViewDependencies() {
    let teamName = this.session.getName();
    if(this.showDependencies) {
      this.gs.showTeamDependencies(teamName);
    } else {
      this.gs.hideTeamDependencies(teamName);
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
