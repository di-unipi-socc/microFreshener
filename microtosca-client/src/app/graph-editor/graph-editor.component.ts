import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link, Service, Database } from '../d3';
import  {GraphService} from "../graph.service";

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit {

  // @ViewChild('directedGraph') directedGraph: ElementRef;

  private graph: ForceDirectedGraph;

  _options = {width: 600, height:500};

  constructor(private gs: GraphService) {  }

  ngOnInit() {
    this.graph = this.gs.getGraph();
    this.graph.nodes.forEach( (node) => {
        console.log(node);
    });
  }

  onSelectedNode(n:Node){
    console.log(n);
  }

  onSelectedLink(l:Link){
    console.log(l);
  }
 
}
