import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,  ViewChild, ElementRef, Input} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link, Service, Database } from '../d3';
import  {GraphService} from "../graph.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-editor',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit, AfterViewInit {

  // @ViewChild('directedGraph') directedGraph: ElementRef;

  // private graph: ForceDirectedGraph;

  _options = {width: 1000, height:1000};

  constructor(private gs: GraphService, private ref: ChangeDetectorRef) {  }

  ngAfterViewInit() {
    // this.gs.graph.initSimulation(this._options);
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
