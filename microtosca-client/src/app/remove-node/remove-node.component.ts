import { Component, OnInit } from '@angular/core';
import {GraphService} from "../graph.service";
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';
import {Node} from '../d3'

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
  styleUrls: ['./remove-node.component.css']
})
export class RemoveNodeComponent implements OnInit {

  selectedNodes: Node[];
  nodes:Node[];

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {   }

  ngOnInit() {
    this.nodes = this.config.data.nodes;
  }

  removeNodes(){
    this.ref.close(this.selectedNodes);
  }



}
