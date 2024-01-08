import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmell, NodeSmell, Smell } from '../smells/smell';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NotAllowedRefactoring } from '../refactorings/refactoring-policy';
import { Refactoring } from '../refactorings/refactoring-command';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IgnoreAlwaysRefactoring } from '../refactorings/ignore-refactoring';
import { Command } from 'src/app/commands/icommand';

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
  ignoreAction: Command;

  jointNodeModel;
  @Input() smell: (NodeSmell | GroupSmell);

  constructor(
    private invoker: GraphInvoker,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
        this.invoker.executeCommand(this.ignoreAction)
        .then(() => {
          let smell = this.smell;
          this.resetSidebar();
          this.messageService.add({ severity: 'success', summary: 'Smell ignored', detail: `${smell.getName()} will be ignored.` });
        })
        .catch((reason) => this.messageService.add({ severity: 'error', summary: 'Smell cannot be ignored', detail: reason }));
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
        if(!(refactoring instanceof IgnoreAlwaysRefactoring)) {
          this.actions.push({ "label": refactoring?.getName(), "description": refactoring?.getDescription(), "value": refactoring });
        } else {
          this.ignoreAction = refactoring;
        }
      });
    }
  }

}
