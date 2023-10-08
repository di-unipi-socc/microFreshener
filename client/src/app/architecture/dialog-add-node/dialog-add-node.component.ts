import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { g } from 'jointjs';
import { ToolSelectionService } from '../../editor/tool-selection/tool-selection.service';

@Component({
  selector: 'app-dialog-add-node',
  templateUrl: './dialog-add-node.component.html',
  styleUrls: ['./dialog-add-node.component.css']
})
export class DialogAddNodeComponent {

  name: string;
  position: g.Point;
  selectedNodeType: string;
  selectedCommunicationPatternType: string; //CommunicationPattern;
  
  communicationPatternTypes: string[]; //CommunicationPattern[];
  showCommunicationPatternType: boolean;

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit() {
    this.name = null;
    this.position = this.config.data.clickPosition;
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
    this.ref.close({
      name: this.name,
      position: this.position,
      nodeType: this.selectedNodeType,
      communicationPatternType: this.selectedCommunicationPatternType
    });
  }

}
