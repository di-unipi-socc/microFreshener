import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Graph } from '../model/graph';

import * as joint from 'jointjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: Graph;

  paper: joint.dia.Paper;

  zoom;

  private graphUrl = environment.serverUrl + '/api/model?format=json';
  // private graphUrl = environment.serverUrl + '/microtosca/'

  private graphUrlPost = environment.serverUrl + '/api/model';
  // private graphUrlPost = environment.serverUrl + '/microtosca/';

  private graphUrlExamples = environment.serverUrl + '/api/example';
  
  private teamUrl = environment.serverUrl + '/api/team/';


  constructor(private http: HttpClient) {
    this.graph = new Graph('');
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
    this.getZoom().zoomIn();
  }

  zoomOut() {
    this.getZoom().zoomOut();
  }

  setZoom(zoom) {
    this.zoom = zoom;
  }

  getZoom() {
    return this.zoom;
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

  getTeam(team_name: string): Observable<string> {
    let url = `${this.teamUrl}${team_name}`;  
    console.log(url)
    return this.http.get<string>(url).pipe(
      tap(_ => this.log(`fetched team ${team_name}`)),
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`GraphServiceService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }

}
