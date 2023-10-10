import { Component, Input } from '@angular/core';
import { TeamsService } from '../teams.service';
import * as joint from 'jointjs';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailComponent {

  @Input() team: joint.shapes.microtosca.SquadGroup;

  // Nodes info
  services: joint.shapes.microtosca.Service[];
  datastores: joint.shapes.microtosca.Datastore[];
  communicationPatterns: joint.shapes.microtosca.CommunicationPattern[];
  nodesQuantity;

  // Graph listener for changes
  private readonly GRAPH_EVENTS: string = "add remove";
  private graphEventsListener: () => void;

  constructor(
    private teams: TeamsService,
    private graphService: GraphService
  ) {}

  ngOnInit() {
    // Get the groups and relative interacting nodes
    this.setInfo();
    // Refresh at every graph update
    this.graphEventsListener = () => { this.setInfo() };
    this.graphService.getGraph().on(this.GRAPH_EVENTS, this.graphEventsListener);
  }

  ngOnDestroy() {
    if(this.graphEventsListener)
      this.graphService.getGraph().off(this.GRAPH_EVENTS, this.graphEventsListener);
  }

  private setInfo() {
    let teamDetails = this.teams.getTeamDetails(this.team);
    let nodes = teamDetails.getNodes();
    // Set owned services
    this.services = nodes.services;
    // Set other nodes owned
    this.datastores = nodes.datastores;
    this.communicationPatterns = nodes.communicationPatterns;
    // Set nodes quantity
    this.nodesQuantity = this.services.length + this.datastores.length + this.communicationPatterns.length;
  }

}
