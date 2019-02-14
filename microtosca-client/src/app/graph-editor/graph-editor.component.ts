import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,  ViewChild, ElementRef, Input} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link, Service, Database } from '../d3';
import  {GraphService} from "../graph.service";
import * as d3 from 'd3';
import * as joint from 'jointjs';

@Component({
  selector: 'app-graph-editor',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit, AfterViewInit {

  // @ViewChild('directedGraph') directedGraph: ElementRef;

  // private graph: ForceDirectedGraph;

  _options = {width: 500, height:300};

  constructor(private gs: GraphService, private ref: ChangeDetectorRef) {  }

  ngAfterViewInit() {

    var g = <joint.dia.Graph><any>this.gs.graphjoint; // ATTENTION <any> cast for deiable error on casting

      var paper = new joint.dia.Paper({
        el: document.getElementById('myholder'),
        model: g,
        width: this._options.width,
        height: this._options.height,
        gridSize: 1
    });
  }

  ngOnInit() { }

  addNode(){
    this.gs.getGraphjoint().addService("wq3");
  }

  onSelectedNode(n:Node){
    console.log(n);
  }

  onSelectedLink(l:Link){
    console.log(l);
  }
 
}
