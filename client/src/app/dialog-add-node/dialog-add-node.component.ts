import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { CommunicationPattern } from "../model/communicationpattern";
import { AnalyserService } from "../analyser.service";

import { AddServiceCommand, AddDatabaseCommand, AddCommunicationPatternCommand } from '../graph-editor/graph-command';
import { GraphService } from '../graph.service';
import { Command } from '../invoker/icommand';

@Component({
  selector: 'app-dialog-add-node',
  templateUrl: './dialog-add-node.component.html',
  styleUrls: ['./dialog-add-node.component.css']
})
export class DialogAddNodeComponent implements OnInit {

  name: string;

  selectedNodeType: string;

  communicationPatternTypes: CommunicationPattern[];
  selectedCommunicationPatternType: CommunicationPattern;
  showCommunicationPatternType: boolean = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, public as: AnalyserService, public gs: GraphService) { }

  ngOnInit() {
    this.name = null;
    this.selectedNodeType = null;
    this.showCommunicationPatternType = false;
    this.selectedCommunicationPatternType = null;

    this.as.getCommunicationPatterns()
      .then(cps => this.communicationPatternTypes = cps);

  }

  checkedCommPattern() {
    this.showCommunicationPatternType = true;
  }

  isDisableSave() {
    return this.name == null || this.name == "" || this.selectedNodeType == null || (this.selectedNodeType == "communicationPattern" && this.selectedCommunicationPatternType == null);
  }

  save() {
    let command: Command;
    let message: string;
    switch (this.selectedNodeType) {
      case "service":
        command = new AddServiceCommand(this.gs.getGraph(), this.name);
        message = `Service ${this.name} added correctly`;
        break;
      case "database":
        command = new AddDatabaseCommand(this.gs.getGraph(), this.name);
        message = `Database  ${this.name}  added correctly`;
        break;
      case "communicationPattern":
        command = new AddCommunicationPatternCommand(this.gs.getGraph(), this.name, this.selectedCommunicationPatternType.type);
        message += `Communication Pattern ${this.name} ${this.selectedCommunicationPatternType} added correctly`;
        break;
      default:
        // this.messageService.add({ severity: 'error', summary: `${data.type} is not recognized has node type` });
        break;
    }
    this.ref.close({"command":command, "msg":message});

  }

}
