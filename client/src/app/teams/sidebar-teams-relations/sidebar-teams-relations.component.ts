import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { TeamsService } from '../teams.service';
import * as joint from 'jointjs';
import { GraphService } from 'src/app/graph/graph.service';

@Component({
  selector: 'app-sidebar-teams-relations',
  templateUrl: './sidebar-teams-relations.component.html',
  styleUrls: ['./sidebar-teams-relations.component.css']
})
export class SidebarTeamsRelationsComponent {

  @Input() visible: boolean;
  @ViewChild('teamRelationsContainer') teamRelationsContainer: ElementRef;
  @ViewChild('teamRelations') teamRelations: ElementRef;

  private readonly OPACITY_ARC = 0.5;
  private readonly OPACITY_RIBBON = 0.2;
  private readonly OPACITY_HIGHLIGHT = 1;
  private readonly LINK_COLOR = "black";
  private readonly TEAM_COLOR = "#E5E7E9";

  private names;
  private colors;
  private index;

  constructor(
    private graphService: GraphService,
    private teamsService: TeamsService
  ) {}

  ngOnChanges(change: SimpleChanges) {
    if(change.visible.previousValue === false && change.visible.currentValue === true) {
      this.createChordDiagram();
    }
    if(change.visible.previousValue === true && change.visible.currentValue === false) {
      d3.select(this.teamRelations.nativeElement).select("svg").remove();
    }
  }

  private createChordDiagram() {
    // Data for the chord diagram
    let teams = this.teamsService.getTeams();
    let data: [string, string, number][] = this.teamInteractionsToMatrix(teams);
    
    // create the svg area
    let width = 650;
    let height = width;
    let widthRadiusRatio = 1.1;
    let innerRadius = Math.min(width/widthRadiusRatio, height/widthRadiusRatio) * 0.5 - 20;
    let outerRadius = innerRadius + 20;
    let d3any: any = d3;
    // Compute a dense matrix from the weighted links in data.
    this.names = teams.map((t) => t.getName());
    this.index = new Map(this.names.map((name, i) => [name, i]));
    let matrix = Array.from(this.index, () => new Array(this.names.length).fill(0));
    data.forEach( ([source, target, value]) => { matrix[this.index.get(source)][this.index.get(target)] += value });

    let chord = d3any.chordDirected()
        .padAngle(12 / innerRadius)
        .sortSubgroups(d3any.descending)
        .sortChords(d3any.descending);

    let arc = d3any.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let ribbon = d3any.ribbonArrow()
        .radius(innerRadius - 20)
        .padAngle(1 / innerRadius);

    this.colors = d3any.schemeCategory10;

    let svg: any = d3any.select(this.teamRelations.nativeElement)
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [-width / 2 -20, -height / 2 -20, width+20, height+20])
              .attr("style", "width: 100%; height: auto; font: 10px;");

    let chords = chord(matrix);

    let textCount = 0;
    let getUid = () => {
      textCount++;
      return {
        id: "M-text-" + textCount,
        href: "#M-text-" + textCount
      }
    }
    let textId = getUid();

    svg.append("path")
        .attr("id", textId.id)
        .attr("fill", "none")
        .attr("d", d3any.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}))

    svg.append("g")
      .selectAll()
      .data(chords)
      .join("path")
        .attr("d", ribbon)
        .attr("fill", d => this.colors[d.target.index])
        .attr("fill-opacity", this.OPACITY_RIBBON)
        .style("mix-blend-mode", "multiply")
        .attr("id", d => `ribbon-${d.source.index}-${d.target.index}`)
        .attr("class", d => `ribbon-source-${d.source.index} ribbon-target-${d.target.index}`)
        .on("mouseover", (event) => {
          let ribbonId = event.target.id;
          this.mouseOverRibbon(ribbonId);
        })
        .on("mouseout", (event) => {
          let ribbonId = event.target.id;
          this.mouseOutRibbon(ribbonId);
        })
      .append("title")
        .text(d => `${d.source.value} interaction${d.source.value!=1 ? 's' : ''} of nodes owned by ${this.names[d.source.index]} with nodes owned by ${this.names[d.target.index]}`)

    let g = svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g");

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => this.colors[d.index])
        .attr("fill-opacity", this.OPACITY_ARC)
        .attr("stroke", "#fff")
        .attr("id", d => `arc-${d.index}`)
        .on("mouseover", (event) => {
          let arcId = event.target.id;
          this.mouseOverArc(arcId);
        })
        .on("mouseout", (event) => {
          let arcId = event.target.id;
          this.mouseOutArc(arcId);
        })

    g.append("text")
        .attr("dy", -3)
        .append("textPath")
        .attr("xlink:href", textId.href)
        .attr("startOffset", d => d.startAngle * outerRadius)
        .text(d => this.names[d.index]);

    g.append("title")
        .text(d => `Interactions involving nodes in ${this.names[d.index]}`);
  }

  private teamInteractionsToMatrix(teams: joint.shapes.microtosca.SquadGroup[]): [string, string, number][] {
    let matrix: [string, string, number][] = []
    
    teams.map((s) => this.teamsService.getTeamInteractions(s)
                                      .outgoing
                                      .forEach(teamInteraction => { 
                                        matrix.push([
                                          s.getName(),
                                          teamInteraction[0].getName(),
                                          teamInteraction[1].length
                                        ]);
                                      }));
    return matrix;
  }

  private mouseOverArc(arcId) {
    // Equivalent to overing all ribbons
    let arcIndex = arcId.replace("arc-", "");
    console.log("arc index", arcIndex);
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
    let sourceTeamName = this.names[sourceIndex];
    let sourceTeam = this.graphService.getGraph().findGroupByName(sourceTeamName);
    let targetTeamName = this.names[targetIndex];
    let targetTeam = this.graphService.getGraph().findGroupByName(targetTeamName);
    // Color links
    let outgoingLinks = this.teamsService.getTeamInteractions(sourceTeam).outgoing;
    let ribbonTeamInteraction = outgoingLinks.filter(([g, ls]) => g == targetTeam);
    ribbonTeamInteraction.map(([g, ls]) => ls.forEach((l) => l.attr("line/stroke", this.colors[targetIndex])));
    // Color teams
    sourceTeam.attr("body/fill", this.colors[sourceIndex]);
    targetTeam.attr("body/fill", this.colors[targetIndex]);
  }

  private restoreGraphColor() {
    this.graphService.getGraph().getLinks().forEach((link) => {
      link.attr("line/stroke", this.LINK_COLOR);
    });
    this.teamsService.getTeams().forEach((t) => {
      t.attr("body/fill", this.TEAM_COLOR);
    })
  }

}
