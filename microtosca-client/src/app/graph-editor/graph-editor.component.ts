import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphService } from "../graph.service";
import * as joint from 'jointjs';

@Component({
    selector: 'app-graph-editor',
    templateUrl: './graph-editor.component.html',
    styleUrls: ['./graph-editor.component.css']
})

export class GraphEditorComponent implements OnInit, AfterViewInit {

    _options = { width: 1200, height:800 };

    paper: joint.dia.Paper;

    constructor(private gs: GraphService) { }


    ngOnInit() { }

    ngAfterViewInit() {

        this.paper = new joint.dia.Paper({
            el: document.getElementById('jointjsgraph'),
            model: this.gs.getGraph().getJointGraph(),
            width: this._options.width,
            height: this._options.height,
            gridSize: 1,
            background: {
                color: 'rgba(0, 255, 0, 0.3)'
            }
        });

        var odb = this.gs.getGraph().addDatabase("orderdb");
        var s = this.gs.getGraph().addService("shipping");
        var o = this.gs.getGraph().addService("order");

        var r = this.gs.getGraph().addCommunicationPattern("rabbitmq", 'mb');

        this.gs.getGraph().addRunTimeInteraction(o.id, odb.id);
        this.gs.getGraph().addDeploymentTimeInteraction(s.id, o.id);
        this.gs.getGraph().addRunTimeInteraction(s.id, odb.id);


        this.addLinkMouseOver();
        this.addNodeMOuseOver();
        this.createLink();

    }

    createLink(){
        // Create a new link by dragging
        this.paper.on('blank:pointerdown', function(evt, x, y) {
              var link = new joint.shapes.standard.Link();
              link.set('source', { x: x, y: y });
              link.set('target', { x: x, y: y });
              link.addTo(this.model);
              evt.data = { link: link, x: x, y: y };
            })
        
        this.paper.on('blank:pointermove', function(evt, x, y) {
              evt.data.link.set('target', { x: x, y: y });
            });

        this.paper.on('blank:pointerup', function(evt) {
              var target = evt.data.link.get('target');
              if (evt.data.x === target.x && evt.data.y === target.y) {
                  // remove zero-length links
                  evt.data.link.remove();
              }
        });
    }

    addNodeMOuseOver(){
        this.paper.on('element:pointerclick', function(element){
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
                new joint.linkTools.Remove({ distance: 20 }),
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

}
