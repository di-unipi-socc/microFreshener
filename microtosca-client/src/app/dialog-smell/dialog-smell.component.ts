import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { Smell } from '../analyser/smell';
import { AddMessageRouterRefactoring } from '../refactor/refactoring';

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

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService, ) {
    this.actions = [
      { "label": "Ignore Once", "value": { "description": "ignore the smell" } },
      { "label": "Ignore Always", "value": { "description": "Ignore the smell always" } }];
  }


  ngOnInit() {

    if (this.config.data) {
      this.jointNodeModel = this.config.data.model;
      this.smell = <Smell>this.config.data.selectedsmell;
      this.smell.getRefactorings().forEach(Refactoring => {
        this.actions.push({ "label": Refactoring['name'], "value": { "description": Refactoring['description'] } });
      })
    }
  }

  save() {
    if (this.selectedAction == 0) {
      this.jointNodeModel.addIgnoreOnceSmell(this.smell);
      this.messageService.add({ severity: 'success', summary: 'Ingnore once selected' });
    } else if (this.selectedAction == 1) {
      this.jointNodeModel.addIgnoreAlwaysSmell(this.smell);
      this.messageService.add({ severity: 'success', summary: 'Ingnore always selected' });
    }
    console.log(this.selectedAction);
    console.log(this.smell.getRefactorings()[0]);
    this.ref.close(this.smell.getRefactorings()[0]);
  }

}
