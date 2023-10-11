import { Component, Input } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-sidebar-team-details',
  templateUrl: './sidebar-team-details.component.html',
  styleUrls: ['./sidebar-team-details.component.css']
})
export class SidebarTeamDetailsComponent {

  teamsInfo;
  teamSelected: boolean;
  @Input() selectedTeamName: string;
  selectedTeamInfo;

  private readonly GRAPH_EVENTS: string = "add remove";
  private graphEventsListener: () => void;

  public charts: {
    serviceVsNonService: {},
    teamInteractions: {}
  };
  private documentStyle;
  private doughnutCutout;
  
  constructor(
    private graphService: GraphService,
    private teamService: TeamsService
  ) {}

  ngOnInit() {
    // If selectedTeamName has been received as input
    if(this.selectedTeamName)
      this.teamSelected = true;
    // Get the groups and relative interacting nodes
    this.updateTeamsInfo();
    // Set data for change view on team selection
    this.teamSelected = false;
    // Refresh teams at every graph update
    this.graphEventsListener = () => {
      this.updateTeamsInfo();
      if(this.teamSelected)
        this.more(this.selectedTeamName);
      };
    this.graphService.getGraph().on(this.GRAPH_EVENTS, this.graphEventsListener);
    // Set chart styling
    this.documentStyle = getComputedStyle(document.documentElement);
    this.doughnutCutout = '25%';
  }

  ngOnDestroy() {
    this.graphService.getGraph().off(this.GRAPH_EVENTS, this.graphEventsListener);
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

  more(selectedTeamName) {
    this.selectedTeamName = selectedTeamName;
    this.teamsInfo = this.teamsInfo.filter(teamInfo => teamInfo.team.getName() == selectedTeamName);
    this.selectedTeamInfo = this.teamsInfo[0];
    this.updateCharts();
    this.teamSelected = true;
  }

  less() {
    this.teamSelected = false;
    this.updateTeamsInfo();
  }

  updateCharts() {
    this.charts = {
      serviceVsNonService: this.getServiceVsNonServiceChart(),
      teamInteractions: this.getTeamInteractionsChart(),
      /*edge: this.getEdgeChart()*/
    };
    console.log("charts is", this.charts);
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
    console.log("interactions ingoing outgoing", this.selectedTeamInfo.teamInteractions.ingoing, this.selectedTeamInfo.teamInteractions.outgoing)
    let ingoingMap: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = new Map(this.selectedTeamInfo.teamInteractions.ingoing);
    let outgoingMap: Map<joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]> = new Map(this.selectedTeamInfo.teamInteractions.outgoing);
    let teams = new Set<joint.shapes.microtosca.SquadGroup>(Array.from(ingoingMap.keys()).concat(Array.from(outgoingMap.keys())));
    console.log("teams are", teams);
    let labels = [];
    let outgoingInteractionsData = [];
    let ingoingInteractionsData = [];
    teams.forEach((t) => {
      let labelOutgoing: string;
      let labelIngoing: string;
      let otherName = t ? t.getName() : "unassigned nodes";
      let outgoing = outgoingMap.get(t);
      if(outgoing) {
        outgoingInteractionsData.push(outgoing.length);
        labelOutgoing = this.selectedTeamName + " ➡ " + otherName;
      } else {
        outgoingInteractionsData.push(0);
        labelOutgoing = "";
      }
      let ingoing = ingoingMap.get(t);
      if(ingoing) {
        ingoingInteractionsData.push(ingoing.length);
        labelIngoing = this.selectedTeamName + " ⬅ " + otherName;
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
                label: 'Interactions from ' + this.selectedTeamName,
                backgroundColor: this.documentStyle.getPropertyValue('--pink-500'),
                borderColor: this.documentStyle.getPropertyValue('--pink-500'),
                data: outgoingInteractionsData
            },
            {
                label: 'Interactions towards ' + this.selectedTeamName,
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
