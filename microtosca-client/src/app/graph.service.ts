import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Graph } from './model/graph';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: Graph;

  private graphUrl = 'http://127.0.0.1:8000/v2/graph/?format=json';  // URL to web api
  private graphUrlPost = 'http://127.0.0.1:8000/v2/graph/';         // URL to web api
  private analysisUrl = 'http://127.0.0.1:8000/v2/graph/analyse/';  // URL to web api

  constructor(private http: HttpClient) {
    this.graph = new Graph('hello-world');
  }

  getGraph(): Graph {
    return this.graph;
  }

  setGraph(g: Graph) {
    this.graph = g;
    console.log(g.name);
    console.log("updated graph");
  }

  // Export the graph to JSON
  exportToJSON() {
    return JSON.stringify(this.graph.toJSON());
  }

  /** POST: upload the local graph to the server */
  uploadGraph(): Observable<string> {
    var graphJson = this.exportToJSON();
    console.log(graphJson);
    return this.http.post<string>(this.graphUrlPost, graphJson, httpOptions);
  }

  // uploadFile():Observable<string>{
  //   return this.http.post<string>(this.graphUrlPost, graphJson, httpOptions);
  // }

  // download the graph stored into the server
  downloadGraph(): Observable<string> {
    return this.http.get<string>(this.graphUrl).pipe(
      tap(_ => this.log(`fetched graph`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`GraphServiceService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }

}
