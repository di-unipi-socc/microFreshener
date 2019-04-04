import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { Smell } from '../analyser/smell';

@Component({
  selector: 'app-dialog-smell',
  templateUrl: './dialog-smell.component.html',
  styleUrls: ['./dialog-smell.component.css']
})
export class DialogSmellComponent implements OnInit {
  actions: Object[] = [];
  selectedAction: Object = {};

  jointNodeModel;
  smell: Smell;
  smellDescription: string;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService, ) {
    this.actions = [
      { "label": "Ignore Once", "value": { "description": "ignore the smell" } },
      { "label": "Ignore Always", "value": { "description": "Ignore the smell always" } }];
  }


  ngOnInit() {

    if (this.config.data) {
      this.jointNodeModel = this.config.data.model;
      this.smell = <Smell>this.config.data.selectedsmell;

      this.smellDescription = this.smell.getDescription();

      this.smell.getRefactorings().forEach(ref => {
        this.actions.push({ "label": ref['name'], "value": { "description": ref['description'] } });
      })
    }
  }

  save() {
    console.log(this.selectedAction);
    if (this.selectedAction == 0) {
      this.jointNodeModel.addIgnoreOnceSmell(this.smell);
      this.messageService.add({ severity: 'success', summary: 'Ingnore once selected' });
    } else if (this.selectedAction == 1) {
      this.jointNodeModel.addIgnoreAlwaysSmell(this.smell);
      this.messageService.add({ severity: 'success', summary: 'Ingnore always selected' });
    }
    this.ref.close();
  }

}
