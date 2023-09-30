import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AnalyserService } from "../../refactoring/analyser/analyser.service";

import { AddServiceCommand, AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand } from '../../graph/graph-command';
import { GraphService } from '../../graph/graph.service';
import { Command } from '../../commands/invoker/icommand';

import { g } from 'jointjs';
import { ToolSelectionService } from '../tool-selection/tool-selection.service';

@Component({
  selector: 'app-dialog-add-node',
  templateUrl: './dialog-add-node.component.html',
  styleUrls: ['./dialog-add-node.component.css']
})
export class DialogAddNodeComponent implements OnInit {

  name: string;
  position: g.Point;
  group: joint.shapes.microtosca.Group;

  selectedNodeType: string;

  communicationPatternTypes: string[]; //CommunicationPattern[];
  selectedCommunicationPatternType: string; //CommunicationPattern;
  showCommunicationPatternType: boolean;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, public as: AnalyserService, public gs: GraphService) { }

  ngOnInit() {
    this.name = null;
    this.position = this.config.data.clickPosition;
    this.group = this.config.data.group;
    this.showCommunicationPatternType = false;
    this.communicationPatternTypes = [ToolSelectionService.MESSAGE_BROKER, ToolSelectionService.MESSAGE_ROUTER];
    if(this.config.data.nodeType == ToolSelectionService.MESSAGE_BROKER) {
      this.selectedNodeType = ToolSelectionService.COMMUNICATION_PATTERN;
      this.selectedCommunicationPatternType = ToolSelectionService.MESSAGE_BROKER;
      this.showCommunicationPatternType = true;
    }
    if(this.config.data.nodeType == ToolSelectionService.MESSAGE_ROUTER) {
      this.selectedNodeType = ToolSelectionService.COMMUNICATION_PATTERN;
      this.selectedCommunicationPatternType = ToolSelectionService.MESSAGE_BROKER;
      this.showCommunicationPatternType = true;
    }
    else {
      this.selectedNodeType = this.config.data.nodeType;
      this.selectedCommunicationPatternType = null;
    }
  }

  checkedCommPattern() {
    this.showCommunicationPatternType = true;
  }

  uncheckCommPattern(){
    this.showCommunicationPatternType = false;
  }

  isDisableSave() {
    return this.name == null || this.name == "" || this.selectedNodeType == null || (this.selectedNodeType == ToolSelectionService.COMMUNICATION_PATTERN && this.selectedCommunicationPatternType == null);
  }

  save() {
    let command: Command;
    let message: string;
    switch (this.selectedNodeType) {
      case ToolSelectionService.SERVICE:
        command = new AddServiceCommand(this.gs.getGraph(), this.name, this.position, this.group);
        message = `Service ${this.name} added correctly`;
        break;
      case ToolSelectionService.DATASTORE:
        command = new AddDatastoreCommand(this.gs.getGraph(), this.name, this.position, this.group);
        message = `Datastore  ${this.name}  added correctly`;
        break;
      case ToolSelectionService.COMMUNICATION_PATTERN:
        if(this.selectedCommunicationPatternType === ToolSelectionService.MESSAGE_BROKER){
          command = new AddMessageBrokerCommand(this.gs.getGraph(), this.name, this.position, this.group);
          message += `Message Broker ${this.name} added correctly`;
        }
        else if(this.selectedCommunicationPatternType === ToolSelectionService.MESSAGE_ROUTER){
          command = new AddMessageRouterCommand(this.gs.getGraph(), this.name, this.position, this.group);
          message += `Message Router ${this.name} added correctly`;
        }
        else
         throw new Error(`Node type ${this.selectedNodeType} not recognized`);
        break;
      default:
        throw new Error(`Type of node '${this.selectedNodeType}' not found `);
        // this.messageService.add({ severity: 'error', summary: `${data.type} is not recognized has node type` });
    }
    this.ref.close({"command":command, "msg":message});
  }

}
