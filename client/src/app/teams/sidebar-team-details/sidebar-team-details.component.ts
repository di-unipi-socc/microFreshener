import { Component } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-sidebar-team-details',
  templateUrl: './sidebar-team-details.component.html',
  styleUrls: ['./sidebar-team-details.component.css']
})
export class SidebarTeamDetailsComponent {

  teams: joint.shapes.microtosca.SquadGroup[];

  private readonly GRAPH_EVENTS: string = "add remove";
  private graphEventsListener: () => void;

  constructor(
    private graphService: GraphService
  ) {}

  ngOnInit() {
    // Get the groups and relative interacting nodes
    this.updateTeamsInfo();
    // Refresh at every graph update
    this.graphEventsListener = () => { this.updateTeamsInfo() };
    this.graphService.getGraph().on(this.GRAPH_EVENTS, this.graphEventsListener);
  }

  ngOnDestroy() {
    if(this.graphEventsListener)
      this.graphService.getGraph().off(this.GRAPH_EVENTS, this.graphEventsListener);
  }

  updateTeamsInfo() {
    this.teams = [];
    this.graphService.getGraph().getTeamGroups().forEach(team => {
      this.teams.push(team);
    });
  }

}
