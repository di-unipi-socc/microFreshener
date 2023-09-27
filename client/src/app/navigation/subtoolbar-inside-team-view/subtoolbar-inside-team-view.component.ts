import { Component } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { GraphService } from 'src/app/editing/model/graph.service';

@Component({
  selector: 'app-subtoolbar-inside-team-view',
  templateUrl: './subtoolbar-inside-team-view.component.html',
  styleUrls: ['./subtoolbar-inside-team-view.component.css']
})
export class SubtoolbarInsideTeamViewComponent {

  showDependencies: boolean;

  constructor(
    private session: SessionService,
    private gs: GraphService
  ) {
    this.showDependencies = false;
  }

  toggleViewDependencies() {
    let teamName = this.session.getName();
    if(this.showDependencies) {
      this.gs.showTeamDependencies(teamName);
    } else {
      this.gs.hideTeamDependencies(/*teamName*/);
    }
  }

}
