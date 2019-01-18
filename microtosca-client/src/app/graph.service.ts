import { Injectable } from '@angular/core';
import {ForceDirectedGraph, Node, RunTimeLink,Link, Service, Database, DeploymentTimeLink, CommunicationPattern} from "./d3";

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  graph: ForceDirectedGraph = null;

  constructor() {
    var nodes: Node[] = [];
    var links: Link[] = [];
    nodes.push(new Database(1));
    nodes.push(new Service(1));
    nodes.push(new CommunicationPattern(1));


    links.push(new RunTimeLink(nodes[0], nodes[1]));
    links.push(new DeploymentTimeLink(nodes[1], nodes[2 ]));

    this.graph = new ForceDirectedGraph(nodes, links, { width:200, height:200 });

   }

  getGraph():ForceDirectedGraph{
    return this.graph;
  }

  addNode(n:Node){
    this.graph.addNode(n);
  }

  addLink(l:Link){
    this.graph.addLink(l);
  }
}
