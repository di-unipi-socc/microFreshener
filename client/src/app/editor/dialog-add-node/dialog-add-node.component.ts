import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AnalyserService } from "../../refactoring/analyser/analyser.service";

import { AddServiceCommand, AddDatastoreCommand, AddMessageBrokerCommand, AddMessageRouterCommand, NodeCommand } from '../../commands/node-commands';
import { GraphService } from '../../graph/graph.service';

import { g } from 'jointjs';
import { ToolSelectionService } from '../tool-selection/tool-selection.service';
import { AddMemberToTeamGroupCommand } from 'src/app/commands/team-commands';

@Component({
  selector: 'app-dialog-add-node',
  templateUrl: './dialog-add-node.component.html',
  styleUrls: ['./dialog-add-node.component.css']
})
export class DialogAddNodeComponent implements OnInit {

  name: string;
  position: g.Point;
  team: joint.shapes.microtosca.SquadGroup;

  selectedNodeType: string;

  communicationPatternTypes: string[]; //CommunicationPattern[];
  selectedCommunicationPatternType: string; //CommunicationPattern;
  showCommunicationPatternType: boolean;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, public as: AnalyserService, public gs: GraphService) { }

  ngOnInit() {
    this.name = null;
    this.position = this.config.data.clickPosition;
    this.team = this.config.data.group;
    this.showCommunicationPatternType = false;
    this.communicationPatternTypes = [ToolSelectionService.MESSAGE_BROKER, ToolSelectionService.MESSAGE_ROUTER];
    
    if(this.config.data.nodeType === ToolSelectionService.MESSAGE_BROKER) {
      this.selectedNodeType = ToolSelectionService.COMMUNICATION_PATTERN;
      this.selectedCommunicationPatternType = ToolSelectionService.MESSAGE_BROKER;
      this.showCommunicationPatternType = true;
    } else if(this.config.data.nodeType === ToolSelectionService.MESSAGE_ROUTER) {
      this.selectedNodeType = ToolSelectionService.COMMUNICATION_PATTERN;
      this.selectedCommunicationPatternType = ToolSelectionService.MESSAGE_ROUTER;
      this.showCommunicationPatternType = true;
    } else {
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
    let createNode: NodeCommand;
    let message: string;
    switch (this.selectedNodeType) {
      case ToolSelectionService.SERVICE:
        createNode = new AddServiceCommand(this.gs.getGraph(), this.name, this.position);
        message = `Service ${this.name} added correctly`;
        break;
      case ToolSelectionService.DATASTORE:
        createNode = new AddDatastoreCommand(this.gs.getGraph(), this.name, this.position);
        message = `Datastore  ${this.name}  added correctly`;
        break;
      case ToolSelectionService.COMMUNICATION_PATTERN:
        if(this.selectedCommunicationPatternType === ToolSelectionService.MESSAGE_BROKER){
          createNode = new AddMessageBrokerCommand(this.gs.getGraph(), this.name, this.position);
          message += `Message Broker ${this.name} added correctly`;
        }
        else if(this.selectedCommunicationPatternType === ToolSelectionService.MESSAGE_ROUTER){
          createNode = new AddMessageRouterCommand(this.gs.getGraph(), this.name, this.position);
          message += `Message Router ${this.name} added correctly`;
        }
        else
         throw new Error(`Node type ${this.selectedNodeType} not recognized`);
        break;
      default:
        throw new Error(`Type of node '${this.selectedNodeType}' not found `);
        // this.messageService.add({ severity: 'error', summary: `${data.type} is not recognized has node type` });
    }

    console.log("team?", this.team);
    if(this.team) {
      let addToTeam = new AddMemberToTeamGroupCommand(this.team);
      createNode = createNode.then(addToTeam);
    }

    this.ref.close({"command":createNode, "msg":message});
  }

}
