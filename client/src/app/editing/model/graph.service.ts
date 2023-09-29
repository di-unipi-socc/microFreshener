import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Graph } from '../model/graph';

import * as joint from 'jointjs';
import { UserRole } from 'src/app/core/user-role';
import { EditorPermissionsService } from '../graph-editor/editor-permissions.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: Graph;
  paper: joint.dia.Paper;

  private graphUrl = environment.serverUrl + '/api/model?format=json';
  // private graphUrl = environment.serverUrl + '/microtosca/'

  private graphUrlPost = environment.serverUrl + '/api/model';
  // private graphUrlPost = environment.serverUrl + '/microtosca/';

  private graphUrlExamples = environment.serverUrl + '/api/example';
  
  // private teamUrl = environment.serverUrl + '/api/team/';

  constructor(private http: HttpClient, private editorPermissions: EditorPermissionsService) {
    this.graph = new Graph('');
  }

  // Graph and Paper

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

  // Navigation

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

  // Permissions

  setWritePermissions(role: UserRole, teamName?: string) {
    this.setEditingWritePermission(role, teamName);
    this.setTeamWritePermission(role);
  }

  setEditingWritePermission(role: UserRole, teamName?: string) {
    switch(role) {
        case UserRole.ADMIN:
            // Admin can write everything
            this.editorPermissions.setIsAllowed( (...any: any[]) => { return true; } );
            break;
        case UserRole.TEAM:
            let team = this.getGraph().findGroupByName(teamName);
            if(!team) {
              // The team doesn't exist in the graph, so block everything
              this.editorPermissions.setIsAllowed = (...any: any[]): boolean => { return false; }
            } else {
              // The team exists, so set the consequent permissions
              this.editorPermissions.setIsAllowed( (cell) => (this.isEditingAllowedForATeam(team, cell)) );
              this.editorPermissions.setLinkable(
                (n: joint.shapes.microtosca.Node, n2?: joint.shapes.microtosca.Node): boolean => {
                return this.getGraph().getTeamOfNode(n) == team && (n2 ? this.getGraph().getTeamOfNode(n2) == team : true);
              });
            }
      }
  }

  isEditingAllowedForATeam(team, cell): boolean {
    
    let outgoingLinks = this.getGraph().getOutgoingLinksOfATeamFrontier(team);
    let nodesLinkedToFrontier = outgoingLinks.map((link) => { return link.getSourceElement(); });
    
    if(cell.isLink()) {
      // Check that the links the user is adding doesn't involve other teams' nodes
      let source = cell.getSourceElement();
      let sourceTeam = this.getGraph().getTeamOfNode(source);
      if(!sourceTeam || sourceTeam != team) {
        return false;
      }
      let target = cell.getTargetElement();
      let targetTeam = this.getGraph().getTeamOfNode(target);
      if(!targetTeam || targetTeam != team) {
        return false;
      }
    } else {
      let nodeTeam = this.getGraph().getTeamOfNode(cell);
      // Check that the node belongs to the team and that it is not linked to the frontier
      if(nodeTeam != team || nodesLinkedToFrontier.includes(cell)) {
        return false;
      }
    }

    return true;
  }

  setTeamWritePermission(role: UserRole) {
    switch(role) {
      case UserRole.ADMIN:
        this.editorPermissions.setIsTeamWriteAllowed( () => { return true; } );
        break;
      case UserRole.TEAM:
        this.editorPermissions.setIsTeamWriteAllowed( () => { return false; } );
        break;
    }
  }

  // Teams

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

  private setVisibilityOfLinkAndRelatedNodesAndGroups(link: joint.shapes.microtosca.RunTimeLink, visible: boolean, linkColor?: string) {
    let node = <joint.shapes.microtosca.Node> link.getTargetElement();
    let visibility = visible ? "visible" : "hidden";
    link.attr("./visibility", visibility);
    if(linkColor)
      link.attr("line/stroke", linkColor);
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

  // Logging

  // Log a HeroService message with the MessageService
  private log(message: string) {
    console.log(`GraphService: ${message}`)
  }

  // Import and Export

  // Export the graph to JSON format
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

}