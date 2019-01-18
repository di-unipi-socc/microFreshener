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
  _options = {width: 600, height:600};

  constructor(private gs: GraphService) {
    this.graph = gs.getGraph();
   }

  ngOnInit() {
  }

  onSelectedNode(n:Node){
    console.log(n);
  }

  onSelectedLink(l:Link){
    console.log(l);
  }
 
}
