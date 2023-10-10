import { Component } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-sidebar-team-details',
  templateUrl: './sidebar-team-details.component.html',
  styleUrls: ['./sidebar-team-details.component.css']
})
export class SidebarTeamDetailsComponent {

  teams: joint.shapes.microtosca.SquadGroup[];

  constructor(
    private graphService: GraphService
  ) {}

  ngOnInit() {
    this.updateTeamsInfo();
  }

  updateTeamsInfo() {
    this.teams = this.graphService.getGraph().getTeamGroups();
  }

}
