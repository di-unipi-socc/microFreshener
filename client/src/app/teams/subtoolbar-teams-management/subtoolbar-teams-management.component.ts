import { EventEmitter, Component, Output, ViewChild } from '@angular/core';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TeamsService } from '../teams.service';
import { EditorNavigationService } from 'src/app/navigation/navigation.service';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';
import { GraphInvoker } from 'src/app/commands/invoker';
import { ArchitectureEditingService } from 'src/app/architecture/architecture-editing.service';

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
    private teams: TeamsService,
    private dialogService: DialogService,
    private commands: GraphInvoker,
    private navigation: EditorNavigationService,
    private messageService: MessageService
  ) {
    this.PAPER_EVENTS_LABELS = 'cell:pointerclick';
    this.paperListener = (cellView, evt, x, y) => {this.nodeToBeAddedClicked(cellView)};
    this.nodeList = [];
    this.selectedNodes = [];
  }

  toggleShowTeam(show?: boolean) {
    if(show) {
      this.showTeamToggled = true;
    }
    if(this.showTeamToggled) {
      this.teams.showTeams();
    } else {
      this.teams.hideTeams();
    }
  }

  toggleAddTeam() {
    if(this.addTeamToggled) {
      // Toggle on
      this.updateAddTeamNodeList();
      this.invokerSubscription = this.commands.subscribe((cellView, evt, x, y) => {this.updateAddTeamNodeList()});
      this.navigation.getPaper().on(this.PAPER_EVENTS_LABELS, this.paperListener);
      // Show teams on 'add team' toggle
      this.toggleShowTeam(true);
    } else {
      // Toggle off
      this.invokerSubscription.unsubscribe();
      this.navigation.getPaper().off(this.PAPER_EVENTS_LABELS, this.paperListener);
      const ref = this.dialogService.open(DialogAddTeamComponent, {
        header: 'Add Team',
        width: '50%',
        data: {
          selectedNodes: this.selectedNodes
        }
      });
      ref.onClose.subscribe((data) => {
        if(data) {
          this.teams.addTeam(data.name, data.nodes);
          this.messageService.add({ severity: 'success', summary: `Team ${data.name} created correctly` });
          this.resetLists();
          this.teams.showTeams();
        }
      });
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
      if((this.architecture.isService(node) || this.architecture.isCommunicationPattern(node) || this.architecture.isDatastore(node))
        && !this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node);
        this.addTeam.hide();
        this.messageService.add({ severity: 'success', summary: node.getName() + " added to creating team list."});
      }
    } else if(this.teams.isTeamGroup(cell)) {
      console.log("adding members of a team")
      let team = <joint.shapes.microtosca.SquadGroup> cell;
      this.selectedNodes = this.selectedNodes.concat(team.getMembers().filter(node => !this.selectedNodes.includes(node)));
      this.messageService.add({ severity: 'success', summary: `Nodes added from team ${team.getName()}.`});
    }
  }

  toggleTeamsInfo() {
    // Show teams when toggle "Team info"
    if(this.showTeamsInfoToggled) {
      this.toggleShowTeam();
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
      this.toggleShowTeam(true);
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
