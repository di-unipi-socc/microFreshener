import { Component, OnInit } from '@angular/core';
import {GraphService} from "../graph.service";
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';

import {Node} from "../d3";



@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit {
  nodes : Node[];
  selectedSourceNode: Node;
  selectedTargetNode: Node;

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.nodes = this.gs.getNodes();
  }

  selectedNodes(s: Node, t:Node) {
    this.ref.close({'source':s, 'target':t});
  } 

}
