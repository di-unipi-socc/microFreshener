import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GroupSmell, NodeSmell } from '../smells/smell';
import { Command } from '../../commands/icommand';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-dialog-smell',
  templateUrl: './dialog-smell.component.html',
  styleUrls: ['./dialog-smell.component.css']
})
export class DialogSmellComponent implements OnInit {
  actions: Object[];
  selectedCommand: Command;

  jointNodeModel;
  smell: (NodeSmell | GroupSmell);

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private graphService: GraphService) {
    this.actions = [];
    this.selectedCommand = null;
  }

  ngOnInit() {
    if (this.config.data) {
      this.jointNodeModel = this.config.data.model;
      this.smell = this.config.data.selectedsmell;
      console.debug("Refactorings:", this.smell.getRefactorings());
      this.smell.getRefactorings().forEach(refactoring => {
        this.actions.push({ "label": refactoring?.getName(), "description": refactoring?.getDescription(), "value": refactoring });
      });
      this.moveIgnoreActionsToButtonInDropdownMenu();
    }
  }

  save() {
    this.ref.close(this.selectedCommand);
  }

  moveIgnoreActionsToButtonInDropdownMenu() {
    let ignoreActions = this.actions.filter(action => action["label"] === "Ignore Once" || action["label"] === "Ignore Always");
    if (ignoreActions.length > 0) {
      for(let action of ignoreActions) {
        let index = this.actions.indexOf(action);
        this.actions.splice(index, 1);
        this.actions.push(action);
      }
    }
  }

}
