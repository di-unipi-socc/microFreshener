import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamsService } from '../teams.service';
import { EditorNavigationService } from 'src/app/editor/navigation/navigation.service';
import { Subscription } from 'rxjs';
import { GraphInvoker } from 'src/app/commands/invoker';

@Component({
  selector: 'app-sidebar-team-details',
  templateUrl: './sidebar-team-details.component.html',
  styleUrls: ['./sidebar-team-details.component.css']
})
export class SidebarTeamDetailsComponent {

  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  teamsInfo;

  @Input() list: boolean;

  teamSelected: boolean;
  @Input() selectedTeam: joint.shapes.microtosca.SquadGroup;
  @Output() selectedTeamChange: EventEmitter<joint.shapes.microtosca.SquadGroup> = new EventEmitter<joint.shapes.microtosca.SquadGroup>();
  selectedTeamInfo;

  private invokerSubscription: Subscription;

  public charts: {
    serviceVsNonService: {},
    teamInteractions: {}
  };
  private documentStyle;
  private doughnutCutout;
  
  constructor(
    private graphService: GraphService,
    private teamService: TeamsService,
    private commands: GraphInvoker,
    private navigation: EditorNavigationService
  ) {
    this.teamsInfo = [];
  }

  ngOnChanges(change: SimpleChanges) {

    console.log("sidebar, change is:", change);

    // Sidebar opening
    if(!change.visible?.previousValue && change.visible?.currentValue) {
      this.onSidebarOpen();
    }

    // Sidebar closing
    if(change.visible?.previousValue && !change.visible?.currentValue) {
      this.onSidebarClose();
    }

    // From team detail to team list
    if(!change.list?.previousValue && change.list?.currentValue) {
      this.less();
    }

    // If a team has been selected outside the sidebar, open the team details
    if(change.selectedTeam?.currentValue && change.selectedTeam?.currentValue !== change.selectedTeam?.previousValue) {
      this.more(change.selectedTeam.currentValue);
    }
  }

  onSidebarOpen() {
    // Get the groups and relative interacting nodes
    this.updateTeamsInfo();
    // Set data for change view on team selection
    this.teamSelected = false;
    // Refresh teams at every graph update
    this.invokerSubscription = this.commands.subscribe(() => {
      console.log("change");
      this.updateTeamsInfo();
      if(this.teamSelected)
        this.more(this.selectedTeam);
      });
    // Set chart styling
    this.documentStyle = getComputedStyle(document.documentElement);
    this.doughnutCutout = '25%';

    // If selectedTeam has been received as input
    if(this.selectedTeam)
      this.more(this.selectedTeam);
  }

  onSidebarClose() {
    this.invokerSubscription.unsubscribe();
  }

  updateTeamsInfo() {
    this.teamsInfo = [];
    // Set info to be displayed for each team
    for(let team of this.graphService.getGraph().getTeamGroups()) {
      let teamDetails = this.teamService.getTeamDetails(team);
      let quantity = teamDetails.services.length + teamDetails.datastores.length + teamDetails.communicationPatterns.length;
      let teamInfo = {
        team: team,
        services: teamDetails.services,
        datastores: teamDetails.datastores,
        communicationPatterns: teamDetails.communicationPatterns,
        teamInteractions: teamDetails.teamInteractions,
        edge: teamDetails.edge,
        nodesQuantity: quantity
      };
      this.teamsInfo.push(teamInfo);
    }
  }

  // From list to single team details
  more(selectedTeam) {
    this.selectedTeam = selectedTeam;
    this.selectedTeamChange.emit(selectedTeam);
    this.teamsInfo = this.teamsInfo.filter(teamInfo => teamInfo.team.getName() == selectedTeam.getName());
    this.selectedTeamInfo = this.teamsInfo[0];
    this.updateCharts();
    this.teamSelected = true;
  }

  // From single team details to list (or sidebar close)
  less() {
    this.teamSelected = false;
    this.selectedTeamChange.emit(undefined);
    this.updateTeamsInfo();
    if (!this.list) {
      this.closeSidebar();
    }
  }

  focus(e: joint.dia.Element) {
    this.navigation.moveTo(e);
  }

  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  updateCharts() {
    this.charts = {
      serviceVsNonService: this.getServiceVsNonServiceChart(),
      teamInteractions: this.getTeamInteractionsChart(),
    };
  }

  getServiceVsNonServiceChart() {
    let nServices = this.selectedTeamInfo.services.length;
    let nOtherNodes = this.selectedTeamInfo.nodesQuantity - nServices;
    return {
      data: {
        labels: ['Services', 'Other nodes'],
        datasets: [
            {
              data: [nServices, nOtherNodes],
              backgroundColor: [this.documentStyle.getPropertyValue('--blue-500'), this.documentStyle.getPropertyValue('--pink-500')],
            }
          ]
        },

        options: {
          cutout: this.doughnutCutout,
          plugins: {
            legend: {
                labels: {
                    color: 'black'
                }
            }
        }
        }
      }
  }

  getTeamInteractionsChart() {
    let ingoingMap: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = new Map(this.selectedTeamInfo.teamInteractions.ingoing);
    let outgoingMap: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = new Map(this.selectedTeamInfo.teamInteractions.outgoing);
    let teams = new Set<joint.shapes.microtosca.SquadGroup>(Array.from(ingoingMap.keys()).concat(Array.from(outgoingMap.keys())));
    let labels = [];
    let outgoingInteractionsData = [];
    let ingoingInteractionsData = [];
    let selectedTeamName = this.selectedTeam.getName();
    teams.forEach((t) => {
      let labelOutgoing: string;
      let labelIngoing: string;
      let otherName = t ? t.getName() : "unassigned nodes";
      let outgoing = outgoingMap.get(t);
      if(outgoing) {
        outgoingInteractionsData.push(outgoing.length);
        labelOutgoing = selectedTeamName + " ➡ " + otherName;
      } else {
        outgoingInteractionsData.push(0);
        labelOutgoing = "";
      }
      let ingoing = ingoingMap.get(t);
      if(ingoing) {
        ingoingInteractionsData.push(ingoing.length);
        labelIngoing = selectedTeamName + " ⬅ " + otherName;
      } else {
        ingoingInteractionsData.push(0);
        labelOutgoing = "";
      }
      labels.push([labelOutgoing, labelIngoing]);
    });

    return {
      data: {
        labels: labels,
        datasets: [
            {
                label: 'Interactions from ' + selectedTeamName,
                backgroundColor: this.documentStyle.getPropertyValue('--pink-500'),
                borderColor: this.documentStyle.getPropertyValue('--pink-500'),
                data: outgoingInteractionsData
            },
            {
                label: 'Interactions towards ' + selectedTeamName,
                backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
                borderColor: this.documentStyle.getPropertyValue('--blue-500'),
                data: ingoingInteractionsData
            }
          ]
      },

      options: {
          indexAxis: 'y',
          maintainAspectRatio: true,
          responsive: true,
          aspectRatio: 3,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                  title: () => '' // Disable tooltip title
              }
            }
          },
          scales: {
            x: {
              ticks: {
                  min: 0,
                  stepSize: 1
              },
            },
            y: {
              ticks: {
                  color: 'black',
                  font: {
                    size: 16
                  }
              },
            }
          },
        }
      }
    }

}
