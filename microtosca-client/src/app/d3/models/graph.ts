
import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';


export class Graph {
    public nodes: Node[] = [];
    public links: Link[] = [];
    public group: Node[]; // raggruppa i nou

    constructor(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }

    public getNodes():Node[]{
      return this.nodes;
    }

    public getLinks():Link[]{
      return this.links;
    }

    public addNode(n:Node){
      this.nodes.push(n);
    }
    
}