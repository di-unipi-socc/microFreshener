import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GroupSmellObject, SmellObject } from '../smells/smell';
import { Command } from '../../commands/icommand';
import { GraphInvoker } from 'src/app/commands/invoker';
import { MergeServicesPolicy, MergeServicesRefactoring } from '../refactorings/merge-services';
import { GraphService } from 'src/app/graph/graph.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-sidebar-smell',
  templateUrl: './sidebar-smell.component.html',
  styleUrls: ['./sidebar-smell.component.css']
})
export class SidebarSmellComponent {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  actions: Object[];
  @Input() selectedCommand: Command;
  previousSelectedCommand: Command;

  jointNodeModel;
  @Input() smell: (SmellObject | GroupSmellObject);

  allowedRefactoring: boolean;
  refactoringWarning: string;

  constructor(
    private invoker: GraphInvoker,
    private graphService: GraphService,
    private session: SessionService
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
      //this.onSidebarClose();
    }

    // If a team has been selected outside the sidebar, open the team details
    if(change.smell?.currentValue && change.smell?.currentValue != change.smell?.previousValue) {
      console.debug("smell changed", this.smell);
      this.resetSidebar();
      this.onSidebarOpen();
    }
  }

  checkRestrictions() {
    console.debug("checking restrictions");
    this.allowedRefactoring = true;
    this.refactoringWarning = undefined;
    if(this.session.isTeam()) {
      if(this.selectedCommand instanceof MergeServicesRefactoring) {
        let graph = this.graphService.graph;
        let smell = this.smell;
        let team = graph.findTeamByName(this.session.getTeamName());
        let policy = new MergeServicesPolicy(graph, <SmellObject> smell, team);
        this.allowedRefactoring = policy.isAllowed();
        if(this.allowedRefactoring) {
          console.debug("Allowed");
        } else {
          console.warn("Not allowed");
          this.refactoringWarning = policy.whyNotAllowed();
        }
      }
    }
  }

  apply() {
    this.invoker.executeCommand(this.selectedCommand).then(() => { this.resetSidebar(); this.visible = false; });
    this.closeSidebar();
  }

  resetSidebar() {
    this.actions = [];
    this.selectedCommand = undefined;
  }

  closeSidebar() {
    this.resetSidebar();
    this.smell = undefined;
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
