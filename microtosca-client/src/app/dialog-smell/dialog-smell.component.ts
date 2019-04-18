import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { SmellObject } from '../analyser/smell';
import { AddMessageRouterRefactoring } from '../refactor/refactoring';
import { IRefactoring } from '../refactor/irefactoring';


@Component({
  selector: 'app-dialog-smell',
  templateUrl: './dialog-smell.component.html',
  styleUrls: ['./dialog-smell.component.css']
})
export class DialogSmellComponent implements OnInit {
  actions: Object[] = [];
  selectedAction: Object = {};

  jointNodeModel;
  smell: SmellObject;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService, ) {
    this.actions = [
      { "label": "Ignore Once", "value": { "description": "ignore the smell" } },
      { "label": "Ignore Always", "value": { "description": "Ignore the smell always" } }];
  }


  ngOnInit() {

    if (this.config.data) {
      this.jointNodeModel = this.config.data.model;
      this.smell = <SmellObject>this.config.data.selectedsmell;
      
      this.smell.getRefactorings().forEach(refactoring => {
        this.actions.push({"label": refactoring.getName(), "value": refactoring});
      })
    }
  }

  save() {
    this.ref.close(this.selectedAction);
  }

}
