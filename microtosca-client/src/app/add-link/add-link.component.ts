import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

import * as joint from 'jointjs';

@Component({
  selector: 'add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css']
})
export class AddLinkComponent implements OnInit {
  sourceNodes: joint.dia.Cell[];
  targetNodes: joint.dia.Cell[];

  selectedSourceNode: joint.dia.Cell = null;
  selectedTargetNode: joint.dia.Cell = null;

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.sourceNodes = this.gs.getGraph().getServices().concat(this.gs.getGraph().getCommunicationPattern());
    this.targetNodes = this.gs.getGraph().getNodes();
  }

  save() {
    this.ref.close({ 'source': this.selectedSourceNode, 'target': this.selectedTargetNode });
  }

}
