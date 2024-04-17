import { EventEmitter, Component, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TeamsService } from '../teams.service';
import { EditorNavigationService } from 'src/app/navigation/navigation.service';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { Invoker } from 'src/app/commands/invoker';
import { ArchitectureEditingService } from 'src/app/architecture/architecture-editing.service';
import { ComputeService } from 'src/app/deployment/computes/compute.service';

@Component({
  selector: 'app-subtoolbar-teams-management',
  templateUrl: './subtoolbar-teams-management.component.html',
  styleUrls: ['./subtoolbar-teams-management.component.css']
})
export class SubtoolbarTeamsComponent {

  // Add team
  @ViewChild('teamEditingTool') addTeam;
  public readonly ADD_TEAM_LABEL: string;
  nodeList: SelectItemGroup[];
  selectedNodes: joint.shapes.microtosca.Node[];
  private readonly PAPER_EVENTS_LABELS: string;
  private paperListener;
  private invokerSubscription;

  // Show/Hide teams
  showTeamToggled: boolean;

  // Show Add Teams form
  addTeamToggled: boolean;

  // Show Teams Info
  @Output() viewTeamsInfo: EventEmitter<{}> = new EventEmitter();
  showTeamsInfoToggled: boolean;

  // Show Teams Relations
  showTeamsRelationsToggled: boolean;

  constructor(
    public tools: ToolSelectionService,
    private architecture: ArchitectureEditingService,
    private computes: ComputeService,
    private teams: TeamsService,
    private dialogService: DialogService,
    private commands: Invoker,
    private navigation: EditorNavigationService,
    private messageService: MessageService
  ) {
    this.PAPER_EVENTS_LABELS = 'cell:pointerup';
    this.paperListener = (cellView, evt, x, y) => {this.nodeToBeAddedClicked(cellView)};
    this.nodeList = [];
    this.selectedNodes = [];
  }

  /*toggleShowTeam(show?: boolean) {
    if(show) {
      this.showTeamToggled = true;
    }
    if(this.showTeamToggled) {
      this.teams.showTeams();
    } else {
      this.teams.hideTeams();
    }
  }*/

  stopAddingTeamWithoutSaving() {
    this.addTeamToggled = false;
    this.toggleAddTeam({ withoutSaving: true });
  }

  toggleAddTeam(options?: { withoutSaving?: boolean }) {
    console.debug("toggleAddTeam. options: ", options)
    if(this.addTeamToggled) {
      // Toggle on
      this.updateAddTeamNodeList();
      this.invokerSubscription = this.commands.subscribe((cellView, evt, x, y) => {this.updateAddTeamNodeList()});
      this.navigation.getPaper().on(this.PAPER_EVENTS_LABELS, this.paperListener);
    } else {
      // Toggle off
      this.invokerSubscription.unsubscribe();
      this.navigation.getPaper().off(this.PAPER_EVENTS_LABELS, this.paperListener);
      if(!options?.withoutSaving) {
        const ref = this.dialogService.open(DialogAddTeamComponent, {
          header: 'Add Team',
          width: '50%',
          draggable: true,
          data: {
            selectedNodes: this.selectedNodes
          }
        });
        ref.onClose.subscribe((data) => {
          if(data) {
            if(!this.teams.teamExists(data.name) || data.nodes?.length == 0) {
              this.teams.addTeam(data.name, data.nodes)
              .then(() => { this.messageService.add({ severity: 'success', summary: `Team ${data.name} created correctly` }); })
              .catch((error) => { this.messageService.add({ severity: 'error', summary: error }); });
            } else {
              let team = this.teams.getTeam(data.name);
              this.teams.addMembersToTeam(data.nodes, team)
              .then(() => { this.messageService.add({ severity: 'success', summary: `${data.nodes.map((n) => n?.getName()).join(", ")} ${data.nodes.length == 1 ? "is" : "are"} now owned by ${data.name}` }); })
              .catch((error) => { this.messageService.add({ severity: 'error', summary: error }); });
            }
            this.resetLists();
          }
        });
      }
    }
  }

  private updateAddTeamNodeList() {
    this.nodeList = this.teams.getNodesByTeams();
  }

  private nodeToBeAddedClicked(cellView: joint.dia.CellView) {
    let cell = cellView.model;
    if(this.architecture.isNode(cell)) {
      console.log("cellView.model", cell);
      let node = <joint.shapes.microtosca.Node> cell;
      if((this.architecture.isService(node)
        || this.architecture.isCommunicationPattern(node)
        || this.architecture.isDatastore(node)
        || this.computes.isCompute(node))
        && !this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node);
        this.addTeam.hide();
        this.messageService.add({ severity: 'success', summary: node.getName() + " added to creating team list."});
      }
    }
  }

  toggleTeamsInfo() {
    // Show teams when toggle "Team info"
    if(this.showTeamsInfoToggled) {
      //this.toggleShowTeam();
      this.openTeamsInfoSidebar();
    } else {
      this.closeTeamsInfoSidebar();
    }
  }

  openTeamsInfoSidebar() {
    let sidebarEvent = {
      name: 'viewTeamsInfo',
      visible: true
    }
    this.viewTeamsInfo.emit(sidebarEvent);
  }

  closeTeamsInfoSidebar() {
    let sidebarEvent = {
      name: 'viewTeamsInfo',
      visible: false
    }
    this.viewTeamsInfo.emit(sidebarEvent);
  }

  toggleTeamsRelations() {
    if(this.showTeamsRelationsToggled) {
      //this.toggleShowTeam(true);
      this.openTeamRelationsSidebar();
    } else {
      this.closeTeamRealtionsSidebar();
    }
  }

  openTeamRelationsSidebar() {
    let sidebarEvent = {
      name: 'viewTeamsRelations',
      visible: true
    }
    this.viewTeamsInfo.emit(sidebarEvent);
  }

  closeTeamRealtionsSidebar() {
    let sidebarEvent = {
      name: 'viewTeamsRelations',
      visible: false
    }
    this.viewTeamsInfo.emit(sidebarEvent);
  }

  ngOnDestroy() {
    this.invokerSubscription?.unsubscribe();
    this.navigation.getPaper()?.off(this.PAPER_EVENTS_LABELS, this.paperListener);
  }

  resetLists() {
    this.selectedNodes = [];
    this.nodeList = [];
  }

}
