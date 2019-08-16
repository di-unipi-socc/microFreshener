import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import * as joint from 'jointjs';


@Component({
  selector: 'app-dialog-select-team',
  templateUrl: './dialog-select-team.component.html',
  styleUrls: ['./dialog-select-team.component.css']
})
export class DialogSelectTeamComponent implements OnInit {

  teams: joint.shapes.microtosca.SquadGroup[];
  selectedTeams: joint.shapes.microtosca.SquadGroup[];

  constructor(public gs: GraphService) {

  }

  ngOnInit() {
    this.teams = this.gs.getGraph().getTeamGroups();
  }

  visualizeTeam(){
    
  }

}
