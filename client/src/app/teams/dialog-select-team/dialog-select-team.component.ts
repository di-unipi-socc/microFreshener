import { Component, OnInit } from '@angular/core';
import { GraphService } from 'src/app/editing/model/graph.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
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
    console.log("Found these teams by Dialog Select Team:");
    console.log(this.teams);
  }

  onSelectTeam(team:joint.shapes.microtosca.SquadGroup){
    console.log("Selected team:");
    console.log(team);
    this.ref.close({"show": team});
  }
}
