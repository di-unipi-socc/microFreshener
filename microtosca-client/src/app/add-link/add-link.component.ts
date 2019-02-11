import { Component, OnInit } from '@angular/core';
import {GraphService} from "../graph.service";
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';

import {Node} from "../d3";



@Component({
  selector: 'add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css']
})
export class AddLinkComponent implements OnInit {
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
