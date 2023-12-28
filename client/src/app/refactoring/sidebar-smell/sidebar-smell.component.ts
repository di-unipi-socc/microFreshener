import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmell, NodeSmell } from '../smells/smell';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NotAllowedRefactoring } from '../refactorings/refactoring-policy';
import { Refactoring } from '../refactorings/refactoring-command';

@Component({
  selector: 'app-sidebar-smell',
  templateUrl: './sidebar-smell.component.html',
  styleUrls: ['./sidebar-smell.component.css']
})
export class SidebarSmellComponent {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  actions: Object[];
  @Input() selectedRefactoring: Refactoring;
  previousSelectedRefactoring: Refactoring;

  jointNodeModel;
  @Input() smell: (NodeSmell | GroupSmell);

  constructor(
    private invoker: GraphInvoker
  ) {
    this.resetSidebar();
  }

  ngOnChanges(change: SimpleChanges) {

    // Sidebar opening
    if(!change.visible?.previousValue && change.visible?.currentValue) {
      console.debug("opening sidebar");
      this.onSidebarOpen();
    }

    // Sidebar closing
    if(change.visible?.previousValue && !change.visible?.currentValue) {
      console.debug("closing sidebar");
    }

    // If a team has been selected outside the sidebar, open the team details
    if(change.smell?.currentValue && change.smell?.currentValue != change.smell?.previousValue) {
      console.debug("smell changed", this.smell);
      this.resetSidebar();
      this.onSidebarOpen();
    }
  }

  onRefactoringSelected() {
    if(this.previousSelectedRefactoring) {
      // this.previousSelectedRefactoring.unexecute();
      this.previousSelectedRefactoring = undefined;
    }
    if(!(this.selectedRefactoring instanceof NotAllowedRefactoring)) {
      // this.selectedRefactoring.execute();
      this.previousSelectedRefactoring = this.selectedRefactoring;
    }
    console.debug("Selected refactoring", this.selectedRefactoring?.getName(), "previous", this.previousSelectedRefactoring?.getName())
  }

  canApply()  {
    return this.selectedRefactoring && !(this.selectedRefactoring instanceof NotAllowedRefactoring);
  }

  apply() {
    this.invoker.executeCommand(this.selectedRefactoring).then(() => { this.resetSidebar(); this.visible = false; });
    this.closeSidebar();
  }

  resetSidebar() {
    this.actions = [];
    this.selectedRefactoring = undefined;
  }

  closeSidebar() {
    this.resetSidebar();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSidebarOpen() {
    if (this.smell) {
      console.debug("Smell is", this.smell);
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
