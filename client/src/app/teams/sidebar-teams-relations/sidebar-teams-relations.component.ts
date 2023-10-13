import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { TeamsService } from '../teams.service';
import * as joint from 'jointjs';

@Component({
  selector: 'app-sidebar-teams-relations',
  templateUrl: './sidebar-teams-relations.component.html',
  styleUrls: ['./sidebar-teams-relations.component.css']
})
export class SidebarTeamsRelationsComponent {

  @Input() visible: boolean;
  @ViewChild('teamRelationsContainer') teamRelationsContainer: ElementRef;
  @ViewChild('teamRelations') teamRelations: ElementRef;

  constructor(private teamsService: TeamsService) {}

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
    let names = teams.map((t) => t.getName());
    let index = new Map(names.map((name, i) => [name, i]));
    let matrix = Array.from(index, () => new Array(names.length).fill(0));
    data.forEach( ([source, target, value]) => { matrix[index.get(source)][index.get(target)] += value });

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
    console.log("how much padangle", 1 / innerRadius);

    let colors = d3any.schemeCategory10;

    let svg: any = d3any.select(this.teamRelations.nativeElement)
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [-width / 2 -20, -height / 2 -20, width+20, height+20])
              .attr("style", "width: 100%; height: auto; font: 10px;");

    let chords = chord(matrix);

    let textCount = 0;
    let getUid = () => {
      console.log("textCount is", textCount);
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
        .attr("d", d3any.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}));

    svg.append("g")
        .attr("fill-opacity", 0.2)
      .selectAll()
      .data(chords)
      .join("path")
        .attr("d", ribbon)
        .attr("fill", d => colors[d.target.index])
        .style("mix-blend-mode", "multiply")
      .append("title")
        .text(d => `${d.source.value} interaction${d.source.value!=1 ? 's' : ''} of nodes owned by ${names[d.source.index]} with nodes owned by ${names[d.target.index]}`);

    let g = svg.append("g")
      .selectAll()
      .data(chords.groups)
      .join("g");

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => colors[d.index])
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#fff")

    g.append("text")
        .attr("dy", -3)
        .append("textPath")
        .attr("xlink:href", textId.href)
        .attr("startOffset", d => d.startAngle * outerRadius)
        .text(d => names[d.index]);

    g.append("title")
        .text(d => `Interactions involving nodes in ${names[d.index]}`);
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

}
