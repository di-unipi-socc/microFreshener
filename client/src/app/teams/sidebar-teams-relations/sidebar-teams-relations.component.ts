import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { TeamsService } from '../teams.service';
import * as joint from 'jointjs';
import { GraphInvoker } from 'src/app/commands/invoker';
import { Subscription } from 'rxjs';
import { ArchitectureEditingService } from 'src/app/architecture/architecture-editing.service';

@Component({
  selector: 'app-sidebar-teams-relations',
  templateUrl: './sidebar-teams-relations.component.html',
  styleUrls: ['./sidebar-teams-relations.component.css']
})
export class SidebarTeamsRelationsComponent {

  @Input() visible: boolean;
  @ViewChild('teamRelationsContainer') teamRelationsContainer: ElementRef;
  @ViewChild('teamRelations') teamRelations: ElementRef;

  description: string;

  teams: joint.shapes.microtosca.SquadGroup[];
  interactingTeamsExist: boolean;

  private svg;
  private width;
  private height;

  private readonly OPACITY_ARC = 0.5;
  private readonly OPACITY_RIBBON = 0.2;
  private readonly OPACITY_HIGHLIGHT = 1;
  private readonly LINK_COLOR = "black";
  private readonly TEAM_COLOR = "white";

  private interactingTeamsNames;
  private colors;
  private index;

  private invokerSubscription: Subscription;

  constructor(
    private architecture: ArchitectureEditingService,
    private teamsService: TeamsService,
    private commands: GraphInvoker
  ) {
    this.teams = [];
    this.interactingTeamsExist = false;
  }

  ngAfterViewInit() {
    // create the svg area
    this.width = 650;
    this.height = this.width;
    let d3any: any = d3;
    this.svg = d3any.select(this.teamRelations.nativeElement)
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("viewBox", [-this.width / 2 -20, -this.height / 2 -20, this.width+20, this.height+20])
    .attr("style", "width: 100%; height: auto; font: 10px;");
    // Create listener for graph changes
    this.invokerSubscription = this.commands.subscribe(() => {
      if(this.visible) {
        this.updateChordDiagram();
      }
    });
  }

  ngOnChanges(change: SimpleChanges) {
    if(change.visible.previousValue === false && change.visible.currentValue === true) {
      this.onSidebarOpen();
    }
    if(change.visible.previousValue === true && change.visible.currentValue === false) {
      //this.onSidebarClose();
    }
  }

  ngOnDestroy() {
    this.invokerSubscription?.unsubscribe();
  }

  private onSidebarOpen() {
    this.updateChordDiagram();
  }

  private cleanChordDiagram() {
    d3.select(this.teamRelations.nativeElement).selectAll("svg > *").remove();
  }

  private updateChordDiagram() {
    this.cleanChordDiagram();
    this.teams = this.teamsService.getTeams();
    this.interactingTeamsExist = this.teams.map(t => t.getName()).filter((t) => t).length > 1;
    console.debug("interacting teams", this.teams.map(t => t.getName()).filter((t) => t))
    if(this.interactingTeamsExist)
      this.createChordDiagram(this.teams);
  }

  private createChordDiagram(teams: joint.shapes.microtosca.SquadGroup[]) {

    let d3any: any = d3;
    let widthRadiusRatio = 1.1;
    let innerRadius = Math.min(this.width/widthRadiusRatio, this.height/widthRadiusRatio) * 0.5 - 20;
    let outerRadius = innerRadius + 20;

    // Data for the chord diagram
    let data: [string, string, number][] = this.teamInteractionsToMatrix(teams);
    
    // Compute a dense matrix from the weighted links in data.
    this.interactingTeamsNames = teams.map((t) => t.getName());
    this.index = new Map(this.interactingTeamsNames.map((name, i) => [name, i]));
    let dataMatrix = Array.from(this.index, () => new Array(this.interactingTeamsNames.length).fill(0));
    let cappedDataMatrix = Array.from(this.index, () => new Array(this.interactingTeamsNames.length).fill(0));
    data.forEach(([source, target, value]) => {
      cappedDataMatrix[this.index.get(source)][this.index.get(target)] += value;
      // Cap the value at 20 interactions
      let possiblyCappedValue = Math.min(value, 20);
      cappedDataMatrix[this.index.get(source)][this.index.get(target)] += possiblyCappedValue;
    });

    let chord = d3any.chordDirected()
        .padAngle(400/(innerRadius*(this.interactingTeamsNames.length-1)^2))
        .sortSubgroups(d3any.descending)
        .sortChords(d3any.descending);

    let arc = d3any.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)     

    let ribbon = d3any.ribbonArrow()
        .radius(innerRadius - 20)
        .padAngle(1 / innerRadius);

    this.colors = d3any.schemeCategory10;

    let chords = chord(cappedDataMatrix);

    let textCount = 0;
    let getUid = () => {
      textCount++;
      return {
        id: "M-text-" + textCount,
        href: "#M-text-" + textCount
      }
    }
    let textId = getUid();

    this.svg.append("path")
        .attr("id", textId.id)
        .attr("fill", "none")
        .attr("d", d3any.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}))

    this.svg.append("g")
      .selectAll()
      .data(chords)
      .join("path")
        .attr("d", ribbon)
        .attr("fill", d => this.colors[d.target.index])
        .attr("fill-opacity", this.OPACITY_RIBBON)
        .style("mix-blend-mode", "multiply")
        .attr("id", d => `ribbon-${d.source.index}-${d.target.index}`)
        .attr("class", d => `ribbon-source-${d.source.index} ribbon-target-${d.target.index}`)
        .on("mouseover", (event, d) => {
          let ribbonId = event.target.id;
          this.mouseOverRibbon(ribbonId);
          let nInteractions = d.source.value;
          this.description = `${nInteractions} interaction${nInteractions!=1 ? 's' : ''} from nodes owned by ${this.interactingTeamsNames[d.source.index]} to nodes owned by ${this.interactingTeamsNames[d.target.index]}`;
        })
        .on("mouseout", (event) => {
          let ribbonId = event.target.id;
          this.mouseOutRibbon(ribbonId);
          this.description = "";
        })
      .append("title")
        .text(d => `${d.source.value} interaction${d.source.value!=1 ? 's' : ''} of nodes owned by ${this.interactingTeamsNames[d.source.index]} with nodes owned by ${this.interactingTeamsNames[d.target.index]}`)

    let g = this.svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g");

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => this.colors[d.index])
        .attr("fill-opacity", this.OPACITY_ARC)
        .attr("stroke", "#fff")
        .attr("id", d => `arc-${d.index}`)
        .on("mouseover", (event, d) => {
          let arcId = event.target.id;
          this.mouseOverArc(arcId);
          this.description = `Interactions involving nodes in ${this.interactingTeamsNames[d.index]}`;
        })
        .on("mouseout", (event) => {
          let arcId = event.target.id;
          this.mouseOutArc(arcId);
          this.description = "";
        })

    g.append("text")
        .attr("dy", -3)
        .append("textPath")
        .attr("xlink:href", textId.href)
        .attr("startOffset", d => d.startAngle * outerRadius)
        .text(d => this.interactingTeamsNames[d.index]);

    g.append("title")
        .text(d => `Interactions involving nodes in ${this.interactingTeamsNames[d.index]}`);
  }

  private teamInteractionsToMatrix(teams: joint.shapes.microtosca.SquadGroup[]): [string, string, number][] {
    let matrix: [string, string, number][] = []
    // Get all teams interactions
    teams.map((s) => this.teamsService.getTeamInteractions(s)
                                      .outgoing
                                      .forEach(teamInteraction => {
                                        matrix.push([
                                          s.getName(),
                                          teamInteraction[0].getName(),
                                          teamInteraction[1].length
                                        ]);
                                      }));
    // Filter out non interacting teams
    matrix = matrix.filter((d) => d[2] > 0);
    return matrix;
  }

  private mouseOverArc(arcId) {
    // Equivalent to overing all ribbons
    let arcIndex = arcId.replace("arc-", "");
    d3.selectAll(`.ribbon-source-${arcIndex}`)
      .each((data, i, nodes: any[]) => {
        for(let ribbon of Array.from(nodes)) {
          let ribbonId = ribbon.id;
          this.mouseOverRibbon(ribbonId)
        }
      });
      d3.selectAll(`.ribbon-target-${arcIndex}`)
      .each((data, i, nodes: any[]) => {
        for(let ribbon of Array.from(nodes)) {
          let ribbonId = ribbon.id;
          this.mouseOverRibbon(ribbonId)
        }
      });
  }

  private mouseOutArc(arcId) {
    // Equivalent to outing all ribbons
    let arcIndex = arcId.replace("arc-", "");
    d3.selectAll(`.ribbon-source-${arcIndex}`)
      .each((data, i, nodes: any[]) => {
        for(let ribbon of Array.from(nodes)) {
          let ribbonId = ribbon.id;
          this.mouseOutRibbon(ribbonId)
        }
      });
    d3.selectAll(`.ribbon-target-${arcIndex}`)
      .each((data, i, nodes: any[]) => {
        for(let ribbon of Array.from(nodes)) {
          let ribbonId = ribbon.id;
          this.mouseOutRibbon(ribbonId)
        }
      });
  }

  private mouseOverRibbon(ribbonId) {
    this.ribbonOverChange(ribbonId, true);
  }

  private mouseOutRibbon(ribbonId) {
    this.ribbonOverChange(ribbonId, false);
  }

  private ribbonOverChange(ribbonId, over) {
    d3.select("#" + ribbonId).style("fill-opacity", `${over ? this.OPACITY_HIGHLIGHT : this.OPACITY_RIBBON}`);
    let indices = ribbonId.replace("ribbon-", "").split("-");
    let sourceIndex = indices[0];
    d3.select(`#arc-${sourceIndex}`).style("fill-opacity", `${over ? this.OPACITY_HIGHLIGHT : this.OPACITY_ARC}`);
    let targetIndex = indices[1];
    d3.select(`#arc-${targetIndex}`).style("fill-opacity", `${over ? this.OPACITY_HIGHLIGHT : this.OPACITY_ARC}`);

    if(over)
      this.highlightRibbonSubgraph(sourceIndex, targetIndex);
    else // mouseout
      this.restoreGraphColor();
  }

  private highlightRibbonSubgraph(sourceIndex: string, targetIndex: string) {
    // Get graph references
    let sourceTeamName = this.interactingTeamsNames[sourceIndex];
    let sourceTeam = this.teamsService.getTeam(sourceTeamName);
    let targetTeamName = this.interactingTeamsNames[targetIndex];
    let targetTeam = this.teamsService.getTeam(targetTeamName);
    // Color links
    let outgoingLinks = this.teamsService.getTeamInteractions(sourceTeam).outgoing;
    let ribbonTeamInteraction = outgoingLinks.filter(([g, ls]) => g == targetTeam);
    ribbonTeamInteraction.map(([g, ls]) => ls.forEach((l) => l.attr("line/stroke", this.colors[targetIndex])));
    // Color teams
    sourceTeam.attr("body/fill", this.colors[sourceIndex]);
    targetTeam.attr("body/fill", this.colors[targetIndex]);
  }

  private restoreGraphColor() {
    this.architecture.getLinks().forEach((link) => {
      link.attr("line/stroke", this.LINK_COLOR);
    });
    this.teamsService.getTeams().forEach((t) => {
      t.attr("body/fill", this.TEAM_COLOR);
    })
  }

}
