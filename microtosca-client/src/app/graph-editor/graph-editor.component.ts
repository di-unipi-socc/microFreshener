import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,  ViewChild, ElementRef, Input} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link, Service, Database } from '../d3';
import  {GraphService} from "../graph.service";
import * as d3 from 'd3';
import * as joint from 'jointjs';

import * as _ from 'lodash';  

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit, AfterViewInit {

  _options = {width: 500, height:300};
  paper;
  graph;
  
  constructor(private gs: GraphService, private ref: ChangeDetectorRef) {  }

  ngAfterViewInit() {

    this.graph = <joint.dia.Graph><any>this.gs.getGraph(); // ATTENTION added <any> cast for error on casting

    this.paper = new joint.dia.Paper({
        el: document.getElementById('jointjsgraph'),
        model: this.graph,
        width: this._options.width,
        height: this._options.height,
        gridSize: 1,
        background: {
          color: 'rgba(0, 255, 0, 0.3)'
      }
    });

    this.graph.addDatabase("db");
    this.graph.addService("servi");
    this.graph.addCommunicationPattern("cp", "j");

    // click on element
    this.paper.on('element:pointerdblclick', function(elementView, eventObject, eventX, eventY) {
      // this.resetPaper();
      console.log(eventX);
      console.log(eventY);

      var currentElement = elementView.model;
      currentElement.attr('body/stroke', 'orange')
      alert("clicke on element");
   });

   //bind graph to evetn links
   var adjustGraphVertices = _.partial(this.adjustVertices, this.graph);

   // adjust vertices when a cell is removed or its source/target was changed
   this.graph.on('add remove change:source change:target', adjustGraphVertices);

// adjust vertices when the user stops interacting with an element
    this.paper.on('cell:pointerup', adjustGraphVertices);

  }

  resetPaper(){
      this.paper.drawBackground({
          color: 'white'
      })
  
      var elements = this.paper.model.getElements();
      for (var i = 0, ii = elements.length; i < ii; i++) {
          var currentElement = elements[i];
          currentElement.attr('body/stroke', 'black');
      }
  
      var links = this.paper.model.getLinks();
      for (var j = 0, jj = links.length; j < jj; j++) {
          var currentLink = links[j];
          currentLink.attr('line/stroke', 'black');
          currentLink.label(0, {
              attrs: {
                  body: {
                      stroke: 'black'
                  }
              }
          })
      }
  }

  ngOnInit() { }

  onSelectedNode(n:Node){
    console.log(n);
  }

  onSelectedLink(l:Link){
    console.log(l);
  }


  adjustVertices(graph, cell) {
    // if `cell` is a view, find its model
    cell = cell.model || cell;

    if (cell instanceof joint.dia.Element) {
        // `cell` is an element

        _.chain(graph.getConnectedLinks(cell))
            .groupBy(function(link) {

                // the key of the group is the model id of the link's source or target
                // cell id is omitted
                return _.omit([link.source().id, link.target().id], cell.id)[0];
            })
            .each(function(group, key) {

                // if the member of the group has both source and target model
                // then adjust vertices
                if (key !== 'undefined') this.adjustVertices(graph, _.first(group));
            })
            .value();

        return;
    }

    // `cell` is a link
    // get its source and target model IDs
    var sourceId = cell.get('source').id || cell.previous('source').id;
    var targetId = cell.get('target').id || cell.previous('target').id;

    // if one of the ends is not a model
    // (if the link is pinned to paper at a point)
    // the link is interpreted as having no siblings
    if (!sourceId || !targetId) return;

    // identify link siblings
    var siblings = _.filter(graph.getLinks(), function(sibling) {

        var siblingSourceId = sibling.source().id;
        var siblingTargetId = sibling.target().id;

        // if source and target are the same
        // or if source and target are reversed
        return ((siblingSourceId === sourceId) && (siblingTargetId === targetId))
            || ((siblingSourceId === targetId) && (siblingTargetId === sourceId));
    });

    var numSiblings = siblings.length;
    switch (numSiblings) {

        case 0: {
            // the link has no siblings
            break;

        } case 1: {
            // there is only one link
            // no vertices needed
            cell.unset('vertices');
            break;

        } default: {
            // there are multiple siblings
            // we need to create vertices

            // find the middle point of the link
            var sourceCenter = graph.getCell(sourceId).getBBox().center();
            var targetCenter = graph.getCell(targetId).getBBox().center();
            var midPoint = new joint.g.Line(sourceCenter, targetCenter).midpoint();

            // find the angle of the link
            var theta = sourceCenter.theta(targetCenter);

            // constant
            // the maximum distance between two sibling links
            var GAP = 20;

            _.each(siblings, function(sibling, index) {

                // we want offset values to be calculated as 0, 20, 20, 40, 40, 60, 60 ...
                var offset = GAP * Math.ceil(index / 2);

                // place the vertices at points which are `offset` pixels perpendicularly away
                // from the first link
                //
                // as index goes up, alternate left and right
                //
                //  ^  odd indices
                //  |
                //  |---->  index 0 sibling - centerline (between source and target centers)
                //  |
                //  v  even indices
                var sign = ((index % 2) ? 1 : -1);

                // to assure symmetry, if there is an even number of siblings
                // shift all vertices leftward perpendicularly away from the centerline
                if ((numSiblings % 2) === 0) {
                    offset -= ((GAP / 2) * sign);
                }

                // make reverse links count the same as non-reverse
                var reverse = ((theta < 180) ? 1 : -1);

                // we found the vertex
                var angle = joint.g.toRad(theta + (sign * reverse * 90));
                var vertex = joint.g.Point.fromPolar(offset, angle, midPoint);

                // replace vertices array with `vertex`
                sibling.vertices([vertex]);
            });
        }
    }
}
 
}
