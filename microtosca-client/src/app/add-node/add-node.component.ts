import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css']
})
export class AddNodeComponent implements OnInit {

  name: string;
  selectedCommunicationPatternType: string;ù
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
    this.communicationPatternTypes = [{'name':'Message broker'}, {'name':'Message Router'},{'name':'Api Gateway'}];
  }

  save() {
    this.ref.close({name: this.name, type: this.addingCommunicationPattern ?this.selectedCommunicationPatternType: null});
  }

}
