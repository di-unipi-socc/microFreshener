import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { DialogSmellComponent } from '../dialog-smell/dialog-smell.component';
import { GraphService } from "../graph.service";
import * as joint from 'jointjs';
import '../model/microtosca';
import * as _ from 'lodash';
import { g } from 'jointjs';
import { Analyser } from '../analyser/analyser';
import { Smell } from '../analyser/smell';
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';

@Component({
    selector: 'app-graph-editor',
    templateUrl: './graph-editor.component.html',
    styleUrls: ['./graph-editor.component.css'],
    providers: [DialogService]
})
export class GraphEditorComponent implements OnInit, AfterViewInit {

    _options = { width: 2000, height: 1500 };

    paper: joint.dia.Paper;
    analyser: Analyser;

    constructor(private gs: GraphService, public dialogService: DialogService, private messageService: MessageService) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.paper = new joint.dia.Paper({
            el: document.getElementById('jointjsgraph'),
            model: this.gs.getGraph(),
            width: this._options.width,
            height: this._options.height,
            gridSize: 1,
            defaultLink: new joint.shapes.microtosca.RunTimeLink(),
            linkPinning: false, // do not allow link without a target node
            restrictTranslate: true,
        });

        this.createSampleGraph();

        // console.log(this.gs.getGraph().getNodes());

        console.log(this.gs.getGraph().getGroup('edgenodes'));


        //bind events
        this.bindEvents();

        // enable interactions
        this.bindInteractionEvents(this.adjustVertices, this.gs.getGraph(), this.paper);
        this.addLinkMouseOver();

        // this.createSampleGraph();
        this.applyDirectedGraphLayout();
    }
    createSampleGraph() {
        // this.gs.downloadExample("helloworld")
        //     .subscribe((data) => {
        //       console.log(data);
        //       this.gs.getGraph().builtFromJSON(data);
        //       this.gs.getGraph().applyLayout("LR");
        //       this.messageService.add({severity:'success', summary:'Graph dowloaded correclty', detail:''});
        //     });

        // nodes
        var s = this.gs.getGraph().addService("shipping");
        var odb = this.gs.getGraph().addDatabase("order_db");
        var o = this.gs.getGraph().addService("order");
        var cp = this.gs.getGraph().addCommunicationPattern("rabbitmq", 'mb');
        var gw = this.gs.getGraph().addCommunicationPattern("gateway", 'mr');

        // shipping interactions
        this.gs.getGraph().addRunTimeInteraction(s, odb);
        this.gs.getGraph().addRunTimeInteraction(s, cp);
        this.gs.getGraph().addDeploymentTimeInteraction(s, odb);

        // order interactions
        this.gs.getGraph().addRunTimeInteraction(o, s);
        this.gs.getGraph().addRunTimeInteraction(o, odb);
        this.gs.getGraph().addRunTimeInteraction(o, cp);
        this.gs.getGraph().addDeploymentTimeInteraction(o, s);
        this.gs.getGraph().addDeploymentTimeInteraction(o, odb);

        // squads
        var g = this.gs.getGraph().addTeamGroup("team1",[s,o]);

        // gateway interaction
        this.gs.getGraph().addRunTimeInteraction(gw, s);

        // add EdgeGroup 
        this.gs.getGraph().addEdgeGroup("edgenodes", [o, gw]);
    }

    addTeam() {
        const ref = this.dialogService.open(DialogAddTeamComponent, {
            header: 'Add Team',
            width: '50%',
            // height: '50%'
        });
        ref.onClose.subscribe((data) => {
            this.gs.getGraph().addTeamGroup(data.name, data.nodes);
            this.messageService.add({ severity: 'success', summary: `Team ${data.name} inserted correctly` });
        });

    }

    addNode() {
        const ref = this.dialogService.open(DialogAddNodeComponent, {
            header: 'Add Node',
            width: '50%'
        });
        ref.onClose.subscribe((data) => {
            // { name: this.name, type: this.selectedNodeType, ctype: this.selectedCommunicationPatternType }
            let message = "";
            switch (data.type) {
                case "service":
                    this.gs.getGraph().addService(data.name);
                    message += `Service ${data.name} added correctly`;
                    break;
                case "database":
                    this.gs.getGraph().addDatabase(data.name);
                    message += `Database ${data.name} ${data.ctype} added correctly`;
                    break;
                case "communicationPattern":
                    this.gs.getGraph().addCommunicationPattern(data.name, data.ctype);
                    message += `Communication Pattern ${data.name} ${data.ctype} added correctly`;
                    break;
                default:
                    this.messageService.add({ severity: 'error', summary: `${data.type} is not recognized has node type` });
                    break;
            }
            this.messageService.add({ severity: 'success', summary: message });
        });
    }

    bindEvents() {
        // this.paper.on("blank:pointerclick",(evt,x,y,)=>{
        //     console.log(evt);
        //     console.log(x,y);
        //     this.gs.getGraph().ticker.emit(x);
        // })
        // this.paper.on("blank:contextmenu", function (evt,x,y,){
        //     console.log(evt);
        //     console.log(x,y);
        // })

        // this.paper.on("cell:contextmenu", function (cellview, evt,x,y){
        //     // console.log(cellview.model.addSmell(2));
        //     console.log(x,y);

        // })

        // First, unembed the cell that has just been grabbed by the user.
        this.paper.on('cell:pointerdown', (cellView, evt, x, y) => {

            var cell = cellView.model;

            if (!cell.get('embeds') || cell.get('embeds').length === 0) {
                // Show the dragged element above all the other cells (except when the
                // element is a parent).
                cell.toFront();
            }

            if (cell.get('parent')) {
                this.gs.getGraph().getCell(cell.get('parent')).unembed(cell);
            }
        });

        // When the dragged cell is dropped over another cell, let it become a child of the
        // element below.
        this.paper.on('cell:pointerup', (cellView, evt, x, y) => {
            var cell = cellView.model;
            if (!cell.isLink()) { // otherwise Error when cell.getBBox() is called.
                var cellViewsBelow = this.paper.findViewsFromPoint(cell.getBBox().center());

                if (cellViewsBelow.length) {
                    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
                    var cellViewBelow = _.find(cellViewsBelow, function (c) { return c.model.id !== cell.id });

                    // Prevent recursive embedding.
                    if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
                        cellViewBelow.model.embed(cell);
                    }
                }
            }
        });

        this.paper.on("smell:EndpointBasedServiceInteraction:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation(); // stop any further actions with the smell view (e.g. dragging)
            console.log("EBSI EVENT FIRED");
            var model = cellview.model;
            var smell: Smell = model.getSmell("EndpointBasedServiceInteractionSmell");
            const ref = this.dialogService.open(DialogSmellComponent, {
                data: {
                    model: model,
                    selectedsmell: smell
                },
                header: `Smell: ${smell.name}  Node: ${model.getName()}`,
                width: '90%'
            });

            ref.onClose.subscribe((any) => {
                // TODO: apply the actions selected from the popup.
                // this.messageService.add({severity:'info', summary: 'Smell clodes'});
            });
        })

        this.paper.on("smell:NoApiGateway:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation(); // stop any further actions with the smell view (e.g. dragging)
            console.log("No ApGateway EVENT FIRED");
            var model = cellview.model;
            var smell: Smell = model.getSmell("NoApiGateway");
            const ref = this.dialogService.open(DialogSmellComponent, {
                data: {
                    model: model,
                    selectedsmell: smell
                },
                header: `Smell: ${smell.name}  Node: ${model.getName()}`,
                width: '90%'
            });

            ref.onClose.subscribe((any) => {
                // TODO: apply the actions selected from the popup.
                // this.messageService.add({severity:'info', summary: 'Smell clodes'});
            });
        })


        this.paper.on("smell:SharedPersistency:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation(); // stop any further actions with the smell view (e.g. dragging)
            console.log("SHARED PERSISTENCY EVENT FIRED");
            var model = cellview.model;
            var smell: Smell = model.getSmell("SharedPersistencySmell");
            const ref = this.dialogService.open(DialogSmellComponent, {
                data: {
                    model: model,
                    selectedsmell: smell
                },
                header: `Smell: ${smell.name}  Node: ${model.getName()}`,
                width: '90%'
            });
        })

        this.paper.on("smell:WobblyServiceInteractionSmell:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation(); // stop any further actions with the element view (e.g. dragging)
            console.log("WOBBLY SERVICE INTERACTION EVENT FIRED");
            var model = cellview.model;
            var smell: Smell = model.getSmell("WobblyServiceInteractionSmell");
            const ref = this.dialogService.open(DialogSmellComponent, {
                data: {
                    model: model,
                    selectedsmell: smell
                },
                header: `Smell: ${smell.name}  Node: ${model.getName()}`,
                width: '90%'
            });
        })

        this.paper.on('cell:pointerdblclick', (elementView) => {
            var currentElement = elementView.model;
            currentElement.attr('body/stroke', 'orange');
            this.gs.getGraph().ticker.emit(2);
            console.log(elementView.model);
        });

        // for parent 
        this.gs.getGraph().on('change:size', function (cell, newPosition, opt) {

            if (opt.skipParentHandler) return;

            if (cell.get('embeds') && cell.get('embeds').length) {
                // If we're manipulating a parent element, let's store
                // it's original size to a special property so that
                // we can shrink the parent element back while manipulating
                // its children.
                cell.set('originalSize', cell.get('size'));
            }
        });

        // this.gs.getGraph().on('change:position', (cell, newPosition, opt) =>{

        //     if (opt.skipParentHandler) return;

        //     if (cell.get('embeds') && cell.get('embeds').length) {
        //         // If we're manipulating a parent element, let's store
        //         // it's original position to a special property so that
        //         // we can shrink the parent element back while manipulating
        //         // its children.
        //         cell.set('originalPosition', cell.get('position'));
        //     }

        //     var parentId = cell.get('parent');
        //     if (!parentId) return;

        //     var parent = this.gs.getGraph().getCell(parentId);
        //     var parentBbox = parent.getBBox();

        //     if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
        //     if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));

        //     var originalPosition = parent.get('originalPosition');
        //     var originalSize = parent.get('originalSize');

        //     var newX = originalPosition.x;
        //     var newY = originalPosition.y;
        //     var newCornerX = originalPosition.x + originalSize.width;
        //     var newCornerY = originalPosition.y + originalSize.height;

        //     _.each(parent.getEmbeddedCells(), (child)=> {

        //         var childBbox = child.getBBox();

        //         if (childBbox.x < newX) { newX = childBbox.x; }
        //         if (childBbox.y < newY) { newY = childBbox.y; }
        //         if (childBbox.corner().x > newCornerX) { newCornerX = childBbox.corner().x; }
        //         if (childBbox.corner().y > newCornerY) { newCornerY = childBbox.corner().y; }
        //     });

        //     // Note that we also pass a flag so that we know we shouldn't adjust the
        //     // `originalPosition` and `originalSize` in our handlers as a reaction
        //     // on the following `set()` call.
        //     parent.set({
        //         position: { x: newX, y: newY },
        //         size: { width: newCornerX - newX, height: newCornerY - newY }
        //     }, { skipParentHandler: true });
        // });
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

    applyDirectedGraphLayout() {
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
                .groupBy((link) => {

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
        var siblings = _.filter(graph.getLinks(), function (sibling) {

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
                var midPoint = new g.Line(sourceCenter, targetCenter).midpoint();

                // find the angle of the link
                var theta = sourceCenter.theta(targetCenter);

                // constant
                // the maximum distance between two sibling links
                var GAP = 20;

                _.each(siblings, function (sibling, index) {

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
