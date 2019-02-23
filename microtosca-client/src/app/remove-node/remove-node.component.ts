import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

import * as joint from 'jointjs';

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
  styleUrls: ['./remove-node.component.css']
})
export class RemoveNodeComponent implements OnInit {

  selectedNodes: joint.dia.Cell[];
  nodes: joint.dia.Cell[];

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.nodes = this.config.data.nodes;
  }

  removeNodes() {
    this.ref.close(this.selectedNodes);
  }



}
