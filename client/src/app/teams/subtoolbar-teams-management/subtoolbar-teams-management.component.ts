import { EventEmitter, Component, Output } from '@angular/core';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GraphService } from '../../graph/graph.service';
import { TeamsService } from '../teams.service';
import { EditorNavigationService } from 'src/app/editor/navigation/navigation.service';
import { ToolSelectionService } from 'src/app/editor/tool-selection/tool-selection.service';

@Component({
  selector: 'app-subtoolbar-teams-management',
  templateUrl: './subtoolbar-teams-management.component.html',
  styleUrls: ['./subtoolbar-teams-management.component.css']
})
export class SubtoolbarTeamsComponent {

  // Add team
  public readonly ADD_TEAM_LABEL: string;
  nodeList: SelectItemGroup[];
  selectedNodes: joint.shapes.microtosca.Node[];
  private readonly GRAPH_EVENTS_LABELS: string;
  private readonly PAPER_EVENTS_LABELS: string;
  private graphListener;
  private paperListener;

  // Show Add Teams form
  addTeamToggled: boolean;

  // Show/Hide teams
  showTeamToggled: boolean;

  // Show Teams Info
  @Output() viewTeamsInfo: EventEmitter<{}> = new EventEmitter();
  showTeamsInfoToggled: boolean;

  constructor(
    public tools: ToolSelectionService,
    private teams: TeamsService,
    private dialogService: DialogService,
    private gs: GraphService,
    private navigation: EditorNavigationService,
    private messageService: MessageService
  ) {
    this.GRAPH_EVENTS_LABELS = 'change';
    this.graphListener = (cellView, evt, x, y) => {this.updateAddTeamNodeList()};
    this.PAPER_EVENTS_LABELS = 'cell:pointerclick';
    this.paperListener = (cellView, evt, x, y) => {this.nodeClicked(cellView)};
    this.nodeList = [];
    this.selectedNodes = [];
  }

  toggleShowTeam() {
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
      this.gs.getGraph().on(this.GRAPH_EVENTS_LABELS, this.graphListener);
      this.navigation.getPaper().on(this.PAPER_EVENTS_LABELS, this.paperListener);
      this.showTeamToggled = true;
      // Show teams if not already shown
      this.showTeamToggled = true;
      this.toggleShowTeam();
    } else {
      // Toggle off
      this.gs.getGraph().off(this.GRAPH_EVENTS_LABELS, this.graphListener);
      this.navigation.getPaper().off(this.PAPER_EVENTS_LABELS, this.paperListener);
      if(this.selectedNodes.length > 0) {
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
  }

  private updateAddTeamNodeList() {
    let graph = this.gs.getGraph();
    let nodeList: joint.shapes.microtosca.Node[] = graph.getNodes();
    // Group nodes by squad
    let nodesGroupedBySquads: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.Node[]> = nodeList
      .map(node => [graph.getTeamOfNode(node), node])
      .reduce((map, [team, node]) => {
        let array = map.get(team);
        if(!array) map.set(team, [node])
        else array.push(node);
        return map;
      }, new Map());
    //  Make the SelectItemGroup elements for the menu out of the grouped nodes
    let NO_TEAM_LABEL: string  = "Nodes owned by no one";
    this.nodeList = Array.from(nodesGroupedBySquads
      .keys()).map((team) => {
      let items = nodesGroupedBySquads.get(team);
      return {
        label: team ? team.getName() : NO_TEAM_LABEL,
        value: team,
        items: (items ? items.map(node => ({ label: node.getName(), value: node })) : undefined)
      };
    });
    // Put unassigned nodes in the beginning of the list
    this.nodeList.sort((tA, tB) => {
      if(tA.label === NO_TEAM_LABEL)
        return -1;
      else if(tB.label === NO_TEAM_LABEL)
        return 1;
      else
        return 0;
    });
  }

  private nodeClicked(cellView: joint.dia.CellView) {
    // priority gently left to addLink when clicking an element
    if(!this.tools.enabledActions[ToolSelectionService.LINK]) {
      let graph = this.gs.getGraph();
      let cell = cellView.model;
      if(graph.isNode(cell)) {
        console.log("cellView.model", cell);
        let node = <joint.shapes.microtosca.Node> cell;
        if((graph.isService(node) || graph.isCommunicationPattern(node) || graph.isDatastore(node))
          && !this.selectedNodes.includes(node)) {
          this.selectedNodes.push(node);
          this.messageService.add({ severity: 'success', summary: node.getName() + " added to creating team list."});
        }
      } else if(graph.isTeamGroup(cell)) {
        console.log("adding members of a team")
        let team = <joint.shapes.microtosca.SquadGroup> cell;
        this.selectedNodes = this.selectedNodes.concat(team.getMembers());
        this.messageService.add({ severity: 'success', summary: `Nodes added from team ${team.getName()}.`});
      }
    }
  }

  toggleTeamsInfo() {
    let sidebarEvent = {
      name: 'viewTeamsInfo',
      visible: this.showTeamsInfoToggled
    }
    this.viewTeamsInfo.emit(sidebarEvent);

    // Show teams if not already shown
    if(this.showTeamsInfoToggled) {
      this.showTeamToggled = true;
      this.toggleShowTeam();
    }
  }

  ngOnDestroy() {
    this.gs.getGraph().off(this.GRAPH_EVENTS_LABELS, this.graphListener);
    this.navigation.getPaper().off(this.PAPER_EVENTS_LABELS, this.paperListener);
  }

  resetLists() {
    this.selectedNodes = [];
    this.nodeList = [];
  }

}
