import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmell, NodeSmell, Smell } from '../smells/smell';
import { GraphInvoker } from 'src/app/commands/invoker';
import { NotAllowedRefactoring } from '../refactorings/refactoring-policy';
import { Refactoring } from '../refactorings/refactoring-command';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IgnoreAlwaysRefactoring } from '../refactorings/ignore-refactoring';
import { Command } from 'src/app/commands/icommand';
import { AnalyserService } from '../analyser.service';
import { Subscription } from 'rxjs';
import { NoApiGatewaySmellObject } from '../smells/no-api-gateway';

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

  @Input() smell: Smell;

  private invokerSubscription: Subscription;
  private analysisSubscription: Subscription;
  private lastSmellName: string;
  private lastOdorousName: string;

  constructor(
    private invoker: GraphInvoker,
    private analysis: AnalyserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.actions = [];
  }

  private setSniffedElement() {
    this.lastSmellName = this.smell.getName();
    if(this.smell instanceof NodeSmell) {
      this.lastOdorousName = this.smell.getNode()?.getName();
    }
    if(this.smell instanceof NoApiGatewaySmellObject) {
      this.lastOdorousName = this.smell.getNode()?.getName();
    } else if(this.smell instanceof GroupSmell) {
      this.lastOdorousName = this.smell.getGroup()?.getName();
    }
  }

  ngOnInit() {
    this.invokerSubscription = this.invoker.subscribe(() => {
      if(this.smell) {
        this.setSniffedElement();
      }
      this.resetSidebar();
    });
    this.analysisSubscription = this.analysis.subscribe(() => {
      if(this.lastSmellName) {
        let newSmell = this.analysis.findSmell(this.lastOdorousName, this.lastSmellName);
        if(newSmell) {
          this.smell = newSmell;
          this.updateSmell();
        }
      }
    });
  }

  ngOnDestroy() {
    this.analysisSubscription.unsubscribe();
    this.invokerSubscription.unsubscribe();
  }

  ngOnChanges(change: SimpleChanges) {

    // Sidebar opening
    if(!change.visible?.previousValue && change.visible?.currentValue) {
      console.debug("opening sidebar");
      this.updateSmell();
    }

    // Sidebar closing
    if(change.visible?.previousValue && !change.visible?.currentValue) {
      console.debug("closing sidebar");
      //this.resetSidebar();
    }

    // Smell change with open sidebar
    if(change.smell?.currentValue && change.smell?.currentValue != change.smell?.previousValue) {
      console.debug("smell changed", this.smell);
      this.resetSidebar(this.smell);
      this.updateSmell();
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
          this.messageService.add({ severity: 'success', summary: 'Smell ignored', detail: `${smell?.getName()} will be ignored.` });
        })
        .catch((reason) => this.messageService.add({ severity: 'error', summary: 'Smell cannot be ignored', detail: reason }));
      }
    });
  }

  canApply(selectedRefactoring: Refactoring)  {
    return selectedRefactoring && !(selectedRefactoring instanceof NotAllowedRefactoring);
  }

  apply() {
    let refactoring = this.selectedRefactoring;
    this.invoker.executeCommand(refactoring)
    .then(() => this.messageService.add({ severity: 'success', summary: 'Refactoring applied', detail: `${refactoring?.getName()} applied successfully.` }))
    .catch((err) => this.messageService.add({ severity: 'error', summary: 'Unable to apply refactoring', detail: `An error occurred while applying ${refactoring?.getName()}: ${err}` }));
    this.resetSidebar();
  }

  copy() {
    navigator.clipboard.writeText(this.selectedRefactoring.getDescription())
    .then(() => {
      this.messageService.add({ severity: 'success', summary: 'Copied', detail: "Message copied to clipboard." });
    })
    .catch((error) => {
      this.messageService.add({ severity: 'error', summary: 'Impossible to copy', detail: "Unable to copy to clipboard." });
    });
  }

  resetSidebar(smell?) {
    this.actions = [];
    this.selectedRefactoring = undefined;
    if(!smell)
      this.smell = undefined;
  }

  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  updateSmell() {
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
      this.setSniffedElement();
    }
  }

}
