import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmell, NodeSmell } from '../smells/smell';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NotAllowedRefactoring } from '../refactorings/refactoring-policy';
import { Refactoring } from '../refactorings/refactoring-command';
import { ConfirmationService } from 'primeng/api';

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

  jointNodeModel;
  @Input() smell: (NodeSmell | GroupSmell);

  constructor(
    private invoker: GraphInvoker,
    private confirmationService: ConfirmationService
  ) {
    this.actions = [];
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
      this.resetSidebar();
    }

    // Smell change with open sidebar
    if(change.smell?.currentValue && change.smell?.currentValue != change.smell?.previousValue) {
      console.debug("smell changed", this.smell);
      this.resetSidebar(this.smell);
      this.onSidebarOpen();
    }
  }

  openIgnoreDialog() {
    this.confirmationService.confirm({
      message: `Do you want to ignore this smell from the analysis? It won't be displayed anymore.`,
      header: 'Ignore smell',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.
          this.architecture.deleteNode(node).then(() => {
              this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
          }).catch((reason) => this.messageService.add({ severity: 'error', summary: 'Error on deletion', detail: reason }));
      }
  });

  }

  canApply()  {
    return this.selectedRefactoring && !(this.selectedRefactoring instanceof NotAllowedRefactoring);
  }

  apply() {
    let refactoring = this.selectedRefactoring;
    this.resetSidebar();
    this.invoker.executeCommand(refactoring);
  }

  resetSidebar(smell?) {
    this.actions = [];
    this.selectedRefactoring = undefined;
    this.jointNodeModel = undefined;
    if(!smell)
      this.smell = undefined;
  }

  closeSidebar() {
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
