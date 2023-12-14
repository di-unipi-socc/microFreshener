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
  selectedNode: joint.shapes.microtosca.Node;

  external: boolean;
  nodeList;

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
    this.selectedNode = this.config.data.target;
    let sourceTeam = this.gs.getGraph().getTeamOfNode(this.source)
    this.nodeList = this.teamService.getNodesByTeams().filter(((nodesInTeam) => nodesInTeam.value != sourceTeam));
    this.external = this.config.data.external;

    // show properties only if the source node is a service.
    if (this.gs.getGraph().isService(this.source))
      this.show_properties = true;

  }

  save() {
    this.ref.close({ "source": this.source, "target": this.selectedNode, "circuit_breaker": this.circuit_breaker, "dynamic_discovery": this.dynamic_discovery, "timeout": this.tiemout });
  }

  isTargetPresent(): boolean {
    return this.selectedNode ? true : false;
  }

}
