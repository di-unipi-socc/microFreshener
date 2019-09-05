import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import * as joint from 'jointjs';
import { GraphService } from '../graph.service';


@Component({
  selector: 'app-dialog-add-link',
  templateUrl: './dialog-add-link.component.html',
  styleUrls: ['./dialog-add-link.component.css']
})
export class DialogAddLinkComponent implements OnInit {

  source: joint.shapes.microtosca.Node;
  target: joint.shapes.microtosca.Node;

  show_properties: boolean = false;

  circuit_breaker: boolean = false;
  dynamic_discovery: boolean = false;
  tiemout: boolean = false;

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.source = this.config.data.source;
    this.target = this.config.data.target;

    // show properties only if the source node is a service.
    if (this.gs.getGraph().isService(this.source))
      this.show_properties = true;

  }

  save() {
    this.ref.close({ "circuit_breaker": this.circuit_breaker, "dynamic_discovery": this.dynamic_discovery, "timeout": this.tiemout });
  }

}
