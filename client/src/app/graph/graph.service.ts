import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Graph } from './model/graph';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * This service allows the Graph to be injected.
 */
@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: Graph;

  private graphUrl = environment.serverUrl + '/api/model?format=json';
  // private graphUrl = environment.serverUrl + '/microtosca/'

  private graphUrlPost = environment.serverUrl + '/api/model';
  // private graphUrlPost = environment.serverUrl + '/microtosca/';

  private graphUrlExamples = environment.serverUrl + '/api/example';
  
  // private teamUrl = environment.serverUrl + '/api/team/';

  constructor(private http: HttpClient) {
    this.graph = new Graph('');
  }

  getName() {
    return this.graph.getName();
  }

  setName(name) {
    this.graph.setName(name);
  }

  clearGraph() {
    this.graph.clearGraph();
  }

  // Logging

  // Import and Export

  // POST: upload the local graph to the server
  uploadGraph(filterTeam?: joint.shapes.microtosca.SquadGroup): Observable<any> {
    let graph: Graph = this.graph;
    /*if(filterTeam) {
      let subGraphName = filterTeam.getName() + "-subgraph";
      let subGraph: Graph = new Graph(subGraphName);
      let members = filterTeam.getMembers();
      subGraph.addCells(this.getGraph().getSubgraphFromNodes(members));
      graph = subGraph;
    }*/
    let graphJson = JSON.stringify(graph.toJSON());
    return this.http.post<any>(this.graphUrlPost, graphJson, httpOptions);
  }

  // download the graph stored into the server
  dowloadGraph(): Observable<string> {
    return this.http.get<string>(this.graphUrl)
      .pipe(
        tap(_ => console.debug(`fetched graph`)),
    );
  }

  load(json) {
    this.graph.clear();
    return this.graph.builtFromJSON(json);
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
      tap(_ => console.debug(`fetched example ${name}`)),
    );
  }

}