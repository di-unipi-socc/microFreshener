import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GraphService } from "../graph.service";
import * as joint from 'jointjs';
import * as _ from "lodash";
import { g } from 'jointjs';


@Component({
    selector: 'app-graph-editor',
    templateUrl: './graph-editor.component.html',
    styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit, AfterViewInit {

    _options = { width: 3000, height: 3000 };

    paper: joint.dia.Paper;

    constructor(private gs: GraphService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        this.paper = new joint.dia.Paper({
            el: document.getElementById('jointjsgraph'),
            model: this.gs.getGraph(),
            width: this._options.width,
            height: this._options.height,
            gridSize: 1,
        });

        // enable interactions
        this.bindInteractionEvents(this.adjustVertices, this.gs.getGraph(), this.paper);
        this.addLinkMouseOver();
        this.addNodeMouseOver();

        this.createSampleGraph();
        this.applyDirectedGraphLayout();
    }
    createSampleGraph(){
        var s = this.gs.getGraph().addService("shipping");
        var odb = this.gs.getGraph().addDatabase("orderdb");
        var o = this.gs.getGraph().addService("order");
        var cp = this.gs.getGraph().addCommunicationPattern("rabbitmq", 'mb');

        // shipping
        this.gs.getGraph().addRunTimeInteraction(s, odb);
        this.gs.getGraph().addRunTimeInteraction(s, cp);
        this.gs.getGraph().addDeploymentTimeInteraction(s, odb);
        //order
        this.gs.getGraph().addRunTimeInteraction(o, s);
        this.gs.getGraph().addRunTimeInteraction(o, odb);
        this.gs.getGraph().addRunTimeInteraction(o, cp);

        this.gs.getGraph().addDeploymentTimeInteraction(o, s);
        this.gs.getGraph().addDeploymentTimeInteraction(o, odb);
    }

    bindInteractionEvents(adjustVertices, graph, paper) {

        // bind `graph` to the `adjustVertices` function
        var adjustGraphVertices = _.partial(adjustVertices, graph);

        // adjust vertices when a cell is removed or its source/target was changed
        // graph.on('add', function(cell) { 
        //     alert('New cell with id ' + cell.id + ' added to the graph.') 
        // })
        graph.on('add remove change:source change:target', adjustGraphVertices);

        // adjust vertices when the user stops interacting with an element
        paper.on('cell:pointerup', adjustGraphVertices);
    }

    applyDirectedGraphLayout(){
        // Directed graph layout
        joint.layout.DirectedGraph.layout(this.gs.getGraph(), {
            nodeSep: 50,
            edgeSep: 80,
            rankDir: "TB", // TB
            // ranker: "tight-tree",
            setVertices: false,
          });
    }

    createLink() {
        // Create a new link by dragging
        this.paper.on('blank:pointerdown', function (evt, x, y) {
            var link = new joint.shapes.standard.Link();
            link.set('source', { x: x, y: y });
            link.set('target', { x: x, y: y });
            link.addTo(this.model);
            evt.data = { link: link, x: x, y: y };
        })

        this.paper.on('blank:pointermove', function (evt, x, y) {
            evt.data.link.set('target', { x: x, y: y });
        });

        this.paper.on('blank:pointerup', function (evt) {
            var target = evt.data.link.get('target');
            if (evt.data.x === target.x && evt.data.y === target.y) {
                // remove zero-length links
                evt.data.link.remove();
            }
        });
    }

    addNodeMouseOver() {
        this.paper.on('element:pointerclick', function (element) {
            console.log(element);
        });
    }

    addLinkMouseOver() {
        console.log("adding arrow interaction");
        this.paper.on('link:mouseenter', function (linkView) {
            var tools = [
                // new joint.linkTools.SourceArrowhead(),
                // new joint.linkTools.TargetArrowhead(),
                new joint.linkTools.Vertices({
                    snapRadius: 0,
                    redundancyRemoval: false,
                    vertexAdding: false
                }),
                new joint.linkTools.TargetAnchor(),
                new joint.linkTools.Remove(),
                new joint.linkTools.Button({
                    markup: [{
                        tagName: 'circle',
                        selector: 'button',
                        attributes: {
                            'r': 7,
                            'stroke': '#fe854f',
                            'stroke-width': 3,
                            'fill': 'white',
                            'cursor': 'pointer'
                        }
                    }, {
                        tagName: 'path',
                        selector: 'icon',
                        attributes: {
                            'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                            'fill': 'none',
                            'stroke': '#FFFFFF',
                            'stroke-width': 2,
                            'pointer-events': 'none'
                        }

                        // {
                        //     tagName: 'text',
                        //     textContent: 'invert',
                        //     selector: 'icon',
                        //     attributes: {
                        //         'fill': '#fe854f',
                        //         'font-size': 10,
                        //         'text-anchor': 'middle',
                        //         'font-weight': 'bold',
                        //         'pointer-events': 'none',
                        //         'y': '0.3em'
                        //     }
                    }],
                    distance: -30,
                    action: function () {
                        var link = this.model;
                        var source = link.source();
                        var target = link.target();
                        link.source(target);
                        link.target(source);
                    }
                }),
                // new joint.linkTools.Button({
                // markup: [{
                //     tagName: 'circle',
                //     selector: 'button',
                //     attributes: {
                //         'r': 7,
                //         'stroke': '#fe854f',
                //         'stroke-width': 3,
                //         'fill': 'white',
                //         'cursor': 'pointer'
                //     }
                // }, {
                //     tagName: 'text',
                //     textContent: 'A',
                //     selector: 'icon',
                //     attributes: {
                //         'fill': '#fe854f',
                //         'font-size': 10,
                //         'text-anchor': 'middle',
                //         'font-weight': 'bold',
                //         'pointer-events': 'none',
                //         'y': '0.3em'
                //     }
                // }],
                // distance: -50,
                // action: function() {
                //     var link = this.model;
                //     link.attr({
                //         line: {
                //             strokeDasharray: '5,1',
                //             strokeDashoffset: (link.attr('line/strokeDashoffset') | 0) + 20
                //         }
                //     });
                // }
                // })
            ];

            linkView.addTools(new joint.dia.ToolsView({
                name: 'onhover',
                tools: tools
            }));

        });

        this.paper.on('link:mouseleave', function (linkView) {
            if (!linkView.hasTools('onhover')) return;
            linkView.removeTools();
        });

    }

    adjustVertices = (graph, cell) => {

        // if `cell` is a view, find its model
        cell = cell.model || cell;
    
        if (cell instanceof joint.dia.Element) {
            // `cell` is an element

            _.chain(graph.getConnectedLinks(cell))
                .groupBy((link) =>{
    
                    // the key of the group is the model id of the link's source or target
                    // cell id is omitted
                    return _.omit([link.source().id, link.target().id], cell.id)[0];
                })
                .each((group, key) => {
                    // console.log(group);
                    // console.log(key);
                    // if the member of the group  has both source and target model
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
                var midPoint =  new g.Line(sourceCenter, targetCenter).midpoint();
    
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
                    var angle = g.toRad(theta + (sign * reverse * 90));
                    var vertex = g.Point.fromPolar(offset, angle, midPoint);
    
                    // replace vertices array with `vertex`
                    sibling.vertices([vertex]);
                });
            }
        }
    }
    
    
}
