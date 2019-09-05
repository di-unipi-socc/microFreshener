import { Component, OnInit } from '@angular/core';
import { GraphService } from '../graph.service';
import { DynamicDialogRef } from 'primeng/api';
import * as joint from 'jointjs';


@Component({
  selector: 'app-dialog-select-team',
  templateUrl: './dialog-select-team.component.html',
  styleUrls: ['./dialog-select-team.component.css']
})
export class DialogSelectTeamComponent implements OnInit {

  teams: joint.shapes.microtosca.SquadGroup[];

  constructor(public gs: GraphService, public ref: DynamicDialogRef) {
    this.teams = []
  }

  ngOnInit() {
    this.teams = this.gs.getGraph().getTeamGroups();
  }

  onSelectTeam(team:joint.shapes.microtosca.SquadGroup){
    this.ref.close({"show": team});
  }
}
