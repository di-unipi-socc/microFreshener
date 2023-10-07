import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GraphService } from "../../graph/graph.service";
import * as joint from 'jointjs';
import '../../graph/model/microtosca';

@Component({
  selector: 'app-dialog-add-team',
  templateUrl: './dialog-add-team.component.html',
  styleUrls: ['./dialog-add-team.component.css']
})
export class DialogAddTeamComponent implements OnInit {

  teamName: string;
  selectedNodes: joint.shapes.microtosca.Node[];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.teamName = null;
    if(this.config.data) {
      console.log("received data", this.config.data);
      this.selectedNodes = this.config.data.selectedNodes;
    }
  }

  isDisableSave() {
    return !(this.teamName !== null && this.teamName.replace(" ", "").length>0);
  }

  save() {
    let teamName = this.teamName.replace(" ", "");
    this.ref.close({ name: teamName, nodes: this.selectedNodes});
  }

}
