import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { CommunicationPattern } from "../model/communicationpattern";
import { AnalyserService } from "../analyser.service";

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

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, public as: AnalyserService) { }

  ngOnInit() {
    this.name = null;
    this.selectedNodeType = null;
    this.showCommunicationPatternType = false;
    this.selectedCommunicationPatternType = null;
    //TODO:  add an angular service that get the types form the server
    // this.communicationPatternTypes = [
    //   { 'label': 'Message broker', 'value': ConcreteTypes.MESSAGE_BROKER },
    //   { 'label': 'Circuit breaker', 'value': ConcreteTypes.CIRCUIT_BREAKER },
    //   { 'label': 'Api Gateway', 'value': ConcreteTypes.API_GATEWAY }];
    // { 'label': 'Api Gateway', 'value': ConcreteTypes.SERVICE_DISCOVERY }];

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
    console.log(this.selectedCommunicationPatternType);

    this.ref.close({ name: this.name, type: this.selectedNodeType, ctype: this.selectedCommunicationPatternType });
  }

}
