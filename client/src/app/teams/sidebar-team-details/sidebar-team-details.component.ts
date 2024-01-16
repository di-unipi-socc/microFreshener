import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TeamsService } from '../teams.service';
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
    teamInteractions
  };
  private documentStyle;
  
  constructor(
    private teamService: TeamsService,
    private commands: GraphInvoker
  ) {
    this.teamsInfo = [];
  }

  ngOnChanges(change: SimpleChanges) {

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

    // If selectedTeam has been received as input
    if(this.selectedTeam)
      this.more(this.selectedTeam);
  }

  onSidebarClose() {
    this.invokerSubscription?.unsubscribe();
  }

  updateTeamsInfo() {
    this.teamsInfo = [];
    // Set info to be displayed for each team
    for(let team of this.teamService.getTeams()) {
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
  more(selectedTeam: joint.shapes.microtosca.SquadGroup) {
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

  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  updateCharts() {
    this.charts = {
      teamInteractions: this.getTeamInteractionsChart(),
    };
  }


  getTeamInteractionsChart() {
    let ingoingInteractions: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][] = this.selectedTeamInfo.teamInteractions.ingoing;
    let ingoingLabels: string[] = [];
    let ingoingInteractionsData: number[] = [];
    console.log(ingoingInteractions);
    ingoingInteractions.sort(([s1, ls1], [s2, ls2]) => Math.sign(ls2.length - ls1.length)).forEach(([n, ls]) => {console.log("ingoing squad is", n); ingoingLabels.push(n ? n.getName() : "unassigned nodes"); ingoingInteractionsData.push(ls.length); });
    console.log("sorted", ingoingInteractions);
    let outgoingInteractions: [joint.shapes.microtosca.SquadGroup, joint.shapes.microtosca.RunTimeLink[]][] = this.selectedTeamInfo.teamInteractions.outgoing;
    let outgoingLabels: string[] = [];
    let outgoingInteractionsData: number[] = [];
    outgoingInteractions.sort(([s1, ls1], [s2, ls2]) => Math.sign(ls2.length - ls1.length)).forEach(([n, ls]) => {console.log("outgoing squad is", n); outgoingLabels.push(n ? n.getName() : "unassigned nodes"); outgoingInteractionsData.push(ls.length); });

    let selectedTeamName = this.selectedTeam.getName();

    return {
      outgoing: {
        data: {
          labels: outgoingLabels,
          datasets: [
              {
                  label: 'Interactions from ' + selectedTeamName,
                  backgroundColor: this.documentStyle.getPropertyValue('--pink-500'),
                  borderColor: this.documentStyle.getPropertyValue('--pink-500'),
                  data: outgoingInteractionsData,
                  maxBarThickness: 40
              }
            ]
        },

        options: {
            indexAxis: 'y',
            maintainAspectRatio: true,
            aspectRatio: 4,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                    title: () => '' // Disable tooltip title
                }
              },
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
          },
        },
        ingoing: {
          data: {
            labels: ingoingLabels,
            datasets: [
                {
                    label: 'Interactions towards ' + selectedTeamName,
                    backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
                    borderColor: this.documentStyle.getPropertyValue('--blue-500'),
                    data: ingoingInteractionsData,
                    maxBarThickness: 40
                }
              ]
          },
  
          options: {
            indexAxis: 'y',
            maintainAspectRatio: true,
            aspectRatio: 4,
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

}
