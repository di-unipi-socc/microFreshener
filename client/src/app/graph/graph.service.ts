import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Graph } from './model/graph';
import { Observable, Observer } from 'rxjs';

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

  private readonly graph: Graph;
  private readonly observable: Observable<String>;
  private readonly observers: Set<Observer<String>>;

  private graphUrl = environment.serverUrl + '/api/model?format=json';
  // private graphUrl = environment.serverUrl + '/microtosca/'

  private graphUrlPost = environment.serverUrl + '/api/model';
  // private graphUrlPost = environment.serverUrl + '/microtosca/';

  private graphUrlExamples = environment.serverUrl + '/api/example';
  
  // private teamUrl = environment.serverUrl + '/api/team/';

  constructor(private http: HttpClient) {
    this.graph = new Graph('');
    this.observers = new Set<Observer<String>>();
    this.observable = new Observable<String>((observer) => {
      this.observers.add(observer);
      return {
        unsubscribe: () => { this.observers.delete(observer); }
      }
    });
  }

  getGraph(): Graph {
    return this.graph;
  }

  getUpdates() {
    return this.observable;
  }

  emitUpdate() {
    this.observers.forEach((observer) => {
      observer.next("graph-update");
    });
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

  // POST: upload the local graph to the server
  uploadGraph(teamFilter?: joint.shapes.microtosca.SquadGroup): Observable<any> {
    let graph: Graph = this.graph;
    if(teamFilter) {
      let subGraphName = teamFilter.getName() + "-subgraph";
      let subGraph: Graph = new Graph(subGraphName);
      subGraph.addCells(this.getGraph().getSubgraphFromNodes(teamFilter.getMembers()));
      graph = subGraph;
    }
    let graphJson = JSON.stringify(graph.toJSON());
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