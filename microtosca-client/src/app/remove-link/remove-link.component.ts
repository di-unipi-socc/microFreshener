import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import * as joint from 'jointjs';


@Component({
  selector: 'app-remove-link',
  templateUrl: './remove-link.component.html',
  styleUrls: ['./remove-link.component.css']
})
export class RemoveLinkComponent implements OnInit {
  links: joint.dia.Link[];
  selectedLink: joint.dia.Link[] = [];

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

  }

  ngOnInit() {
    // this.nodes = this.gs.getNodes();
    // this.links = this.gs.getDeploymentTimeLinks();
    this.links = this.config.data.links;
  }

  removeLinks() {
    this.ref.close(this.selectedLink);

  }
}

