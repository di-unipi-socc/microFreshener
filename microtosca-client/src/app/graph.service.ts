import { Injectable } from '@angular/core';
import {ForceDirectedGraph, Node, RunTimeLink,Link, Service, Database, DeploymentTimeLink, CommunicationPattern} from "./d3";
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

  private graphUrl = 'http://127.0.0.1:8000/graph/?format=json';  // URL to web api
  private graphUrlPost = 'http://127.0.0.1:8000/graph/';  // URL to web api
  private nodesUrl = 'http://127.0.0.1:8000/nodes/';  // URL to web api
  private analysisUrl = 'http://127.0.0.1:8000/graph/analyse/';  // URL to web api

  constructor(private http: HttpClient) {
    this.graph =  new Graph();
   }

  getGraph():Graph{
    return this.graph;
  }

  // Export the graph to JSON
  exportToJSON(){
    console.log(this.graph.toJSON())
    return this.graph.toJSON();
  }

  /** POST: upload the local graph to the server */
  uploadGraph (): Observable<ForceDirectedGraph> {
    var graphJson = this.exportToJSON();
    console.log(graphJson);
    return this.http.post<ForceDirectedGraph>(this.graphUrlPost, graphJson, httpOptions);
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
  
  // download the graph stored into the server
  downloadNodes(): Observable<Node[]> {
    return this.http.get<Node[]>(this.nodesUrl).pipe(
      tap(_ => this.log(`fetched nodes`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }

  runRemoteAnalysis(principles:string[]):Observable<string> {
    const params = new HttpParams()
      .set('principles', principles.join()); // principles to be analysed: principles separated by commma
    return this.http.get<string>(this.analysisUrl, {params}).pipe(
      tap(_ => this.log(`Send analysis`)),
      // catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`GraphServiceService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }

}
