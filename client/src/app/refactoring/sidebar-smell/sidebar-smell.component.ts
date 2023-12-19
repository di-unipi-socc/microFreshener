import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmellObject, SmellObject } from '../smells/smell';
import { Command } from '../../commands/icommand';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-sidebar-smell',
  templateUrl: './sidebar-smell.component.html',
  styleUrls: ['./sidebar-smell.component.css']
})
export class SidebarSmellComponent {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  actions: Object[];
  selectedCommand: Command;

  jointNodeModel;
  @Input() smell: (SmellObject | GroupSmellObject);

  constructor(private graphService: GraphService) {
    this.actions = [];
    this.selectedCommand = null;
  }

  ngOnChanges(change: SimpleChanges) {

    // Sidebar opening
    if(!change.visible?.previousValue && change.visible?.currentValue) {
      //this.onSidebarOpen();
    }

    // Sidebar closing
    if(change.visible?.previousValue && !change.visible?.currentValue) {
      //this.onSidebarClose();
    }

    // From team detail to team list
    if(!change.list?.previousValue && change.list?.currentValue) {
      //this.less();
    }

    // If a team has been selected outside the sidebar, open the team details
    if(change.selectedTeam?.currentValue && change.selectedTeam?.currentValue !== change.selectedTeam?.previousValue) {
      //this.more(change.selectedTeam.currentValue);
    }
  }

  ngOnInit() {
    if (this.smell) {
      //this.jointNodeModel = this.config.data.model;
      //this.smell = this.config.data.selectedsmell;
      console.debug("Refactorings:", this.smell.getRefactorings());
      this.smell.getRefactorings().forEach(refactoring => {
        this.actions.push({ "label": refactoring?.getName(), "description": refactoring?.getDescription(), "value": refactoring });
      });
      this.moveIgnoreActionsToButtonInDropdownMenu();
    }
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
