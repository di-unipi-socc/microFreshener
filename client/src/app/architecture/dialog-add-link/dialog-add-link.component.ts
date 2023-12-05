import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import * as joint from 'jointjs';
import { GraphService } from '../../graph/graph.service';
import { TeamsService } from 'src/app/teams-management/teams.service';


@Component({
  selector: 'app-dialog-add-link',
  templateUrl: './dialog-add-link.component.html',
  styleUrls: ['./dialog-add-link.component.css']
})
export class DialogAddLinkComponent implements OnInit {

  source: joint.shapes.microtosca.Node;
  target: joint.shapes.microtosca.Node;

  external: boolean;
  nodeList;
  selectedNode;

  show_properties: boolean = false;

  circuit_breaker: boolean = false;
  dynamic_discovery: boolean = false;
  tiemout: boolean = false;

  constructor(
    private gs: GraphService,
    private teamService: TeamsService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.source = this.config.data.source;
    this.target = this.config.data.target;
    this.nodeList = this.teamService.getNodesByTeams();
    this.external = this.config.data.external;

    // show properties only if the source node is a service.
    if (this.gs.getGraph().isService(this.source))
      this.show_properties = true;

  }

  save() {
    this.ref.close({ "source": this.source, "target": this.getTarget(), "circuit_breaker": this.circuit_breaker, "dynamic_discovery": this.dynamic_discovery, "timeout": this.tiemout });
  }

  getTarget() {
    if(this.target)
      return this.target;
    else
      return this.selectedNode;
  }

  isTargetPresent(): boolean {
    return this.getTarget() ? false : true;
  }

}
