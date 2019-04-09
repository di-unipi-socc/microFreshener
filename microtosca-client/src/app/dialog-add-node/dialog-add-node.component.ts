import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import {ConcreteTypes} from "../model/type";


@Component({
  selector: 'app-dialog-add-node',
  templateUrl: './dialog-add-node.component.html',
  styleUrls: ['./dialog-add-node.component.css']
})
export class DialogAddNodeComponent implements OnInit {

  name: string;

  selectedNodeType: string;

  communicationPatternTypes;
  selectedCommunicationPatternType: string;
  showCommunicationPatternType: boolean = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.name = null;
    this.selectedNodeType = null;
    this.showCommunicationPatternType = false;
    this.selectedCommunicationPatternType = null;
    //TODO:  add an angular service that get the types form the server
    this.communicationPatternTypes = [
      {'label':'Message broker', 'value':ConcreteTypes.MESSAGE_BROKER},
      {'label':'Circuit breaker', 'value':ConcreteTypes.CIRCUIT_BREAKER},
      {'label':'Api Gateway', 'value':ConcreteTypes.API_GATEWAY}];

  }

  checkedCommPattern() {
    this.showCommunicationPatternType = true;
  }

  isDisableSave() {
    return this.name == null || this.name == "" || this.selectedNodeType == null || (this.selectedNodeType  == "communicationPattern" && this.selectedCommunicationPatternType == null);
  }

  save() {
    console.log(this.selectedCommunicationPatternType);

    this.ref.close({ name: this.name, type: this.selectedNodeType, ctype: this.selectedCommunicationPatternType });
  }

}
