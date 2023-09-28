import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Graph } from '../model/graph';

import * as joint from 'jointjs';
import { UserRole } from 'src/app/core/user-role';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: Graph;
  paper: joint.dia.Paper;
  private writePermissions;

  private graphUrl = environment.serverUrl + '/api/model?format=json';
  // private graphUrl = environment.serverUrl + '/microtosca/'

  private graphUrlPost = environment.serverUrl + '/api/model';
  // private graphUrlPost = environment.serverUrl + '/microtosca/';

  private graphUrlExamples = environment.serverUrl + '/api/example';
  
  private teamUrl = environment.serverUrl + '/api/team/';


  constructor(private http: HttpClient) {
    this.graph = new Graph('');
    this.writePermissions = {};
  }

  getGraph(): Graph {
    return this.graph;
  }

  getPaper() {
    return this.paper;
  }

  setPaper(paper: joint.dia.Paper) {
    this.paper = paper;
  }

  hideGraph() {
    this.graph.hideGraph();
  }

  showGraph() {
    this.graph.showGraph();
  }

  fitContent(padding?: number) {
    if(!padding){
      padding = 150;
    }
    this.paper.scaleContentToFit({padding: padding});
  }

  zoomIn() {
    console.error("Callback zoomIn not set");
  }

  zoomOut() {
    console.error("Callback zoomOut not set");
  }

  /** Export the graph to JSON format*/
  exportToJSON() {
    return JSON.stringify(this.graph.toJSON());
  }


  /** POST: upload the local graph to the server */
  uploadGraph(): Observable<any> {
    var graphJson = this.exportToJSON();
    console.log(graphJson);
    return this.http.post<any>(this.graphUrlPost, graphJson, httpOptions);
  }

  // download the graph stored into the server
  dowloadGraph(): Observable<string> {
    return this.http.get<string>(this.graphUrl)
      .pipe(
        tap(_ => this.log(`fetched graph`)),
    );
  }

  load(json) {
    this.graph.clear();
    this.graph.builtFromJSON(json);
  }

  isArchitectureWriteAllowed(cell) {
    return this.writePermissions.isAllowed(cell);
  }

  isTeamWriteAllowed() {
    return this.writePermissions.isTeamWriteAllowed();
  }

  setWritePermissions(role: UserRole, teamName?: string) {
    this.setArchitectureWritePermission(role, teamName);
    this.setTeamWritePermission(role);
  }

  setArchitectureWritePermission(role: UserRole, teamName?: string) {
    switch(role) {
        case UserRole.ADMIN:
            // Admin can write everything
            this.writePermissions.isAllowed = (...any: any[]) => { return true; }
            break;
        case UserRole.TEAM:
            let team = this.getGraph().findGroupByName(teamName);
            if(!team) {
              // The team doesn't exist in the graph, so block everything
              this.writePermissions.isAllowed = (...any: any[]): boolean => { return false; }
            } else {
              // The team exists, so set the consequent permissions
              this.writePermissions.isAllowed = (cell): boolean => {
                if(cell.isLink()) {
                  // Check the teams relative to the source and target elements of links
                  let source = cell.getSourceElement();
                  let sourceTeam = this.getGraph().getTeamOfNode(source);
                  if(!sourceTeam || sourceTeam != team) {
                    return false;
                  }
                  let target = cell.getTargetElement();
                  let targetTeam = this.getGraph().getTeamOfNode(target);
                  if(!targetTeam || targetTeam != team)
                    return false;
                } else {
                  let nodeTeam = this.getGraph().getTeamOfNode(cell);
                  // Check the node team (if any)
                  if(!nodeTeam || nodeTeam != team)
                    return false;
                }

                return true;
              };
            }
      }
  }

  setTeamWritePermission(role: UserRole) {
    switch(role) {
      case UserRole.ADMIN:
        this.writePermissions.isTeamWriteAllowed = () => { return true; }
        break;
      case UserRole.TEAM:
        this.writePermissions.isTeamWriteAllowed = () => { return false; }
        break;
    }
  }

  showTeams() {
    this.graph.showAllTeamBoxes();
  }

  hideTeams() {
    this.graph.hideAllTeamBoxes();
  }

  showTeamDependencies(teamName) {
    let team = this.graph.findGroupByName(teamName);
    team.attr("./visibility","visible");
    this.graph.getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, true, "#007ad9");
        });
  }
  
  hideTeamDependencies(teamName) {
    let team = this.graph.findGroupByName(teamName);
    team.attr("./visibility","hidden");
    this.graph.getOutgoingLinksOfATeamFrontier(team)
        .forEach((link) => {
          this.setVisibilityOfLinkAndRelatedNodesAndGroups(link, false);
        });
  }

  private setVisibilityOfLinkAndRelatedNodesAndGroups(link: joint.shapes.microtosca.RunTimeLink, visible: boolean, color?: string) {
    let node = <joint.shapes.microtosca.Node> link.getTargetElement();
    let visibility = visible ? "visible" : "hidden";
    link.attr("./visibility", visibility);
    if(color)
      link.attr("line/stroke", color);
    node.attr("./visibility", visibility);
    let team = this.graph.getTeamOfNode(node);
    if(team != null)
      team.attr("./visibility", visibility);
  }

  /*getTeam(team_name: string): Observable<string> {
    let url = `${this.teamUrl}${team_name}`;  
    console.log(url)
    return this.http.get<string>(url).pipe(
      tap(_ => this.log(`fetched team ${team_name}`)),
    );
  }*/

  // exportGraphToJSON(): Observable<string> {
  //   var url = this.graphUrl + this.getGraph().getName() + "/"
  //   let params = new HttpParams().set("responseType", "blob");
  //   return this.http.get<string>(this.graphUrl, { params: params })
  //     .pipe(
  //       tap(_ => this.log(`fetched graph`)),
  //     // catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }

  downloadExample(name: string): Observable<string> {
    let params = new HttpParams().set("name", name);
    return this.http.get<string>(this.graphUrlExamples, { params: params }).pipe(
      tap(_ => this.log(`fetched example ${name}`)),
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`GraphServiceService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }

}
