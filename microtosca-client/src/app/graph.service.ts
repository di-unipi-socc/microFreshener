import { Injectable } from '@angular/core';
import {ForceDirectedGraph, Node, RunTimeLink,Link, Service, Database, DeploymentTimeLink, CommunicationPattern} from "./d3";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import * as joint from 'jointjs';

import { GraphFactory } from './graph-factory';
import { Graph } from './model/graph';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  d3graph_tobecancelled: ForceDirectedGraph;
  
  graph: Graph;
  
  graphFactory:GraphFactory; 

  private graphUrl = 'http://127.0.0.1:8000/graph/?format=json';  // URL to web api
  private graphUrlPost = 'http://127.0.0.1:8000/graph/';  // URL to web api
  private nodesUrl = 'http://127.0.0.1:8000/nodes/';  // URL to web api
  private analysisUrl = 'http://127.0.0.1:8000/graph/analyse/';  // URL to web api


  constructor(private http: HttpClient) {
    // factory for creating the graph object used to store the model
    this.graphFactory = new GraphFactory();
    
    this.graph =  this.graphFactory.getGraph("jointjs");

    var nodes: Node[] = [];
    var links: Link[] = [];
    var s = new Service(1,'shipping');
    nodes.push(s);
    var o = new Service(1,'order');
    nodes.push(o);
    var cp = new CommunicationPattern(1,'rabbitmq');
    nodes.push(cp);
    var odb  = new Database(1, 'orderdb');
    nodes.push(odb);

    // links.push(new RunTimeLink(nodes[0], nodes[1]));
    // links.push(new DeploymentTimeLink(nodes[1], nodes[2]));

    s.addDeploymentTimeLink(odb);
    s.addRunTimeLink(odb);
    s.addRunTimeLink(cp);

    o.addRunTimeLink(s);
    o.addDeploymentTimeLink(s);
    o.addRunTimeLink(odb);
    o.addDeploymentTimeLink(odb);
    o.addRunTimeLink(cp);

    this.d3graph_tobecancelled = new ForceDirectedGraph(nodes, links, { width:2000, height:2000 });
   }

  getGraph():Graph{
    return this.graph;
  }

  getNodes():Node[]{
    return this.d3graph_tobecancelled.getNodes();
  }

  getServices():Node[]{
    return this.getNodes().filter(node => node.constructor == Service);
  }

  getDatabase():Node[]{
    return this.getNodes().filter(node => node.constructor == Database);
  }

  getCommunicationPattern():Node[]{
    return this.getNodes().filter(node => node.constructor == CommunicationPattern);
  }

  getRunTimeLinks():RunTimeLink[]{
    return this.d3graph_tobecancelled.getRunTimeLinks();
  }

  getDeploymentTimeLinks():DeploymentTimeLink[]{
    return this.d3graph_tobecancelled.getDeploymentTimeLinks();
  }

  removeLink(l:Link){
    return this.d3graph_tobecancelled.removeLink(l);
  }

  getNode(name:string):Node{
    return this.d3graph_tobecancelled.getNodeByName(name);
  }

  removeNode(node:Node){
    return this.d3graph_tobecancelled.removeNode(node);
  }

  // getGraph():ForceDirectedGraph{
  //   return this.graph;
  // }

  addNode(n:Node){
    this.d3graph_tobecancelled.addNode(n);
  }

  addDeploymenttimeLink(source:Node, target:Node){
    this.d3graph_tobecancelled.addDeploymentTimeLink(source, target);
  }

  addRunTimeLink(source:Node, target:Node){
    this.d3graph_tobecancelled.addRunTimeLink(source, target);
  }

  // Export the graph to JSON
  exportToJSON(){
    return JSON.stringify(this.graph);
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

  clearBadInteractions(){
    this.d3graph_tobecancelled.getNodes().forEach((node)=>{
      node.getOutgoingLinks().forEach((link)=> link.setBadInteraction(false))
    })
  }


}
