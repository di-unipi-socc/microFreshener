import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { SmellObject } from '../analyser/smell';
import { Command } from '../invoker/icommand';

@Component({
  selector: 'app-dialog-smell',
  templateUrl: './dialog-smell.component.html',
  styleUrls: ['./dialog-smell.component.css']
})
export class DialogSmellComponent implements OnInit {
  actions: Object[];
  selectedCommand: Command;

  jointNodeModel;
  smell: SmellObject;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private messageService: MessageService) {
    this.actions = [];
    this.selectedCommand = null;
  }

  ngOnInit() {
    if (this.config.data) {
      this.jointNodeModel = this.config.data.model;
      this.smell = <SmellObject>this.config.data.selectedsmell;

      this.smell.getRefactorings().forEach(refactoring => {
        this.actions.push({ "label": refactoring.getName(), "description": refactoring.getDescription(), "value": refactoring.getCommand() });
      });
    }
  }

  save() {
    this.ref.close(this.selectedCommand);
  }

}
