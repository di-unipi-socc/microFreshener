import { Component, OnInit } from '@angular/core';
import {GraphService} from "../graph.service";
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';

import {Node} from "../d3";
import * as joint from 'jointjs';



@Component({
  selector: 'add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css']
})
export class AddLinkComponent implements OnInit {
  nodes: joint.dia.Cell[];
  selectedSourceNode:joint.dia.Cell = null;
  selectedTargetNode:joint.dia.Cell = null;

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.nodes = this.gs.getGraph().getNodes();
    // this.selectedSourceNode.get('name');
  }

  selectedNodes(s:joint.dia.Cell, t:joint.dia.Cell) {
    this.ref.close({'source':s, 'target':t});
  } 

}
