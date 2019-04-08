import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';


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
    this.communicationPatternTypes = [{ 'name': 'Message broker' }, { 'name': 'Message Router' }, { 'name': 'Api Gateway' }];
  }

  checkedCommPattern() {
    this.showCommunicationPatternType = true;
  }

  isDisableSave() {
    return this.name == null || this.name == "" || this.selectedNodeType == null || (this.selectedNodeType  == "communicationPattern" && this.selectedCommunicationPatternType == null);
  }

  save() {
    this.ref.close({ name: this.name, type: this.selectedNodeType, ctype: this.selectedCommunicationPatternType });
  }

}
