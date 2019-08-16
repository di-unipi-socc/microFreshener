import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { GraphService } from "../graph.service";
import * as joint from 'jointjs';
import '../model/microtosca';

@Component({
  selector: 'app-dialog-add-team',
  templateUrl: './dialog-add-team.component.html',
  styleUrls: ['./dialog-add-team.component.css']
})
export class DialogAddTeamComponent implements OnInit {

  teamName: string;
  nodes: joint.shapes.microtosca.Node[];
  selectedNodes: joint.shapes.microtosca.Node[];

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.teamName = null;
    this.selectedNodes = [];
    this.nodes = this.gs.getGraph().getNodes();

  }

  isDisableSave() {
    return this.teamName == null;
  }

  save() {
    console.log(this.selectedNodes),
    this.ref.close({ name: this.teamName, nodes: this.selectedNodes});
  }

}
