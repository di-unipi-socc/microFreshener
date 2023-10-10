import { Component, Input } from '@angular/core';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailComponent {

  @Input() team: joint.shapes.microtosca.SquadGroup;
  teamDetails;

  constructor(
    private teams: TeamsService
  ) {}

  ngOnInit() {
    this.teamDetails = this.teams.getTeamDetails(this.team);
  }

}
