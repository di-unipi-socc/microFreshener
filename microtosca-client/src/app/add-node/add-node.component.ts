import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

import {ConcreteTypes} from "../model/type";

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css']
})
export class AddNodeComponent implements OnInit {

  name: string;
  selectedCommunicationPatternType: string;
  communicationPatternTypes;
  addingCommunicationPattern:boolean = false;

  constructor(private gs: GraphService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    console.log(this.config.data);
    this.addingCommunicationPattern = false;
    if(this.config.data){
      this.addingCommunicationPattern = this.config.data.showType;
    }    
    console.log(this.addingCommunicationPattern);
    this.name = null;
    //TODO: a service that get the types form the server
    this.communicationPatternTypes = [
    {'label':'Message broker', 'value':ConcreteTypes.MESSAGE_BROKER},
    {'label':'Circuit breaker', 'value':ConcreteTypes.CIRCUIT_BREAKER},
    {'label':'Api Gateway', 'value':ConcreteTypes.API_GATEWAY}];
  }

  save() {
    console.log(this.selectedCommunicationPatternType);
    this.ref.close({name: this.name, type: this.addingCommunicationPattern ?this.selectedCommunicationPatternType: null});
  }

}
