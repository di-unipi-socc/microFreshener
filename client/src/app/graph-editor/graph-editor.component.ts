import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';

import { DialogSmellComponent } from '../dialog-smell/dialog-smell.component';
import { GraphService } from "../graph.service";
import { SmellObject } from '../analyser/smell';
import { DialogAddNodeComponent } from '../dialog-add-node/dialog-add-node.component';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';

import * as joint from 'jointjs';
import '../model/microtosca';
import * as _ from 'lodash';
import { g } from 'jointjs';
import * as $ from 'jquery';
import * as svgPanZoom from 'svg-pan-zoom';

import { GraphInvoker } from "../invoker/invoker";
import { RemoveNodeCommand, AddLinkCommand, RemoveLinkCommand, AddTeamGroupCommand, AddMemberToTeamGroupCommand, RemoveMemberFromTeamGroupCommand, RemoveServiceCommand, RemoveDatastoreCommand, RemoveCommunicationPatternCommand } from '../invoker/graph-command';
import { DialogAddLinkComponent } from '../dialog-add-link/dialog-add-link.component';

@Component({
    selector: 'app-graph-editor',
    templateUrl: './graph-editor.component.html',
    styleUrls: ['./graph-editor.component.css'],
    providers: [DialogService] //, ConfirmationService]
})
export class GraphEditorComponent implements OnInit {

    _options = { width: "95%", height: "80%" };

    paper: joint.dia.Paper;

    svgZoom;

    leftClickselectdNode: joint.shapes.microtosca.Node;
    rightClickselectdNode: joint.shapes.microtosca.Node;


    constructor(private graphInvoker: GraphInvoker, private gs: GraphService, public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.leftClickselectdNode = null;
        this.rightClickselectdNode = null;
    }

    ngOnInit() {
        let canvas = document.getElementById('jointjsgraph');
        var c = $('#canvas');
        this.paper = new joint.dia.Paper({
            el: canvas,
            model: this.gs.getGraph(),
            preventContextMenu: true,
            width: c.outerWidth(),
            height: c.outerHeight(),
            background: { color: 'light' },
            multiLinks: true,
            clickThreshold: 1,
            // restrictTranslate: true,
            gridSize: 1,
            defaultLink: new joint.shapes.microtosca.RunTimeLink(),
            linkPinning: false, // do not allow link without a target node
            validateMagnet: function (cellView, magnet) {
                //return false;
                return magnet.getAttribute('magnet') !== 'false';
            },
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                var sourceId = cellViewS.model.id;
                var targetId = cellViewT.model.id;
                if (sourceId && targetId && sourceId === targetId) // avoid self loop
                    return false;
                else
                    return true;
                // return sourceId === targetId;
                // return (end === 'target' ? cellViewT : cellViewS) instanceof joint.dia.ElementView;
            },
        });

        this.createSampleGraph();

        this.svgZoom = svgPanZoom('#jointjsgraph svg', {
            zoomEnabled: true,
            panEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            minZoom: 0.1,
            maxZoom: 10,
            zoomScaleSensitivity: 0.5,
        });

        this.paper.on('cell:pointerdown', () => {
            this.svgZoom.disablePan();
        });

        this.paper.on('cell:pointerup', () => {
            this.svgZoom.enablePan();
        });

        // bind events
        this.bindEvents();

        // enable interactions
        this.bindInteractionEvents(this.adjustVertices, this.gs.getGraph(), this.paper);

        this.applyDirectedGraphLayout();
    }

  
    createSampleGraph() {
        //  nodes
        var s = this.gs.getGraph().addService("shipping");
        var catalogue = this.gs.getGraph().addService("catalogue");

        var odb = this.gs.getGraph().addDatastore("order_db");
        var o = this.gs.getGraph().addService("order");
        var cp = this.gs.getGraph().addMessageBroker("rabbitmq");
        var gw = this.gs.getGraph().addMessageRouter("Api gateway");

        // shipping interactions
        this.gs.getGraph().addRunTimeInteraction(s, odb);
        this.gs.getGraph().addRunTimeInteraction(s, cp);
        this.gs.getGraph().addRunTimeInteraction(s, catalogue);

        // this.gs.getGraph().addDeploymentTimeInteraction(s, odb);

        // order interactions
        this.gs.getGraph().addRunTimeInteraction(o, s, true, true, true);
        this.gs.getGraph().addRunTimeInteraction(o, odb);
        this.gs.getGraph().addRunTimeInteraction(o, cp);
        // this.gs.getGraph().addDeploymentTimeInteraction(o, s);
        // this.gs.getGraph().addDeploymentTimeInteraction(o, odb);

        // catalogue interactions
        this.gs.getGraph().addRunTimeInteraction(catalogue, o);

        // squads
        var s1 = this.gs.getGraph().addTeamGroup("team-primo");
        s1.addMember(s);
        s1.addMember(o);
        s1.addMember(odb);

        var t2 = this.gs.getGraph().addTeamGroup("team-secondo");
        t2.addMember(gw);
        t2.addMember(cp);
        t2.addMember(catalogue);

        // this.gs.getGraph().showOnlyTeam(s1);

        // gateway interaction
        this.gs.getGraph().addRunTimeInteraction(gw, s);

        // add EdgeGroup 
        let edge = this.gs.getGraph().addEdgeGroup("edgenodes", [o, gw, catalogue]);

    }


    bindEvents() {
        this.bindKeyboardEvents();
        this.bindSingleClickBlank();

        this.bindDoubleClickCell();
        this.bindSingleClickCell();

        this.bindSingleRightClickCell();

        this.bindMouseEnterLink();
        this.bindMouseOverNode();

        this.bindClickOnSmells();
        this.bindClickDeleteNode();

        // this.bindTeamToCoverChildren();
        this.bindTeamMinimize();
        this.bindTeamMaximize();
        this.bindTeamEmbedNodes();
        this.bindChangeTeamEvents();


        //graph eventts
       //  this.bindGraphEvents();
    }

    bindChangeTeamEvents(){
        this.gs.getGraph().on('change:embeds',(element, newEmbeds, opt) =>{

        })
    }

    bindGraphEvents() {
        this.gs.getGraph().on('add', cell => {
            if (cell.isElement())
                this.messageService.add({ severity: 'success', summary: "Node added succesfully", detail: "Node  [" + cell.getName() + "] added." });
            else if (cell.isLink()) {
                var source = (<joint.shapes.microtosca.Node>cell.getSourceElement());
                var target = (<joint.shapes.microtosca.Node>cell.getTargetElement());
                this.messageService.add({ severity: 'success', summary: "Link added succesfully", detail: "Link  from  [" + source.getName() + "] to  [" + target.getName() + "] added." });
            }

        })
        this.gs.getGraph().on('remove', cell => {
            if (cell.isElement())
                this.messageService.add({ severity: 'success', summary: "Node removed  succesfully.", detail: "Node  [" + cell.getName() + "] removed from the model." });
            else if (cell.isLink()) {
                this.messageService.add({ severity: 'success', summary: "Link removed  succesfully." }); //detail: "Link  from  ["+ source.getName() + "] to  ["+ target.getName() +"] removed."});
            }
        })
    }

    bindKeyboardEvents() {
        $(document).keydown((e) => {
            var DELETE_KEY = 46;
            var ZETA_KEY = 90;
            var YPSILON_KEY = 89;


            if (e.which == DELETE_KEY) {
                this.deleteSelected();
            }
            if (e.keyCode == ZETA_KEY && e.ctrlKey) {
                this.graphInvoker.undo();
            }
            if (e.keyCode == YPSILON_KEY && e.ctrlKey) {
                this.graphInvoker.redo();
            }
            // if (!(e.which == 115 && e.ctrlKey) && !(e.which == 19)) {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     alert("Ctrl S");
            // }
        });
    }

    deleteSelected() {
        if (this.leftClickselectdNode) {
            var node = this.leftClickselectdNode;
            this.confirmationService.confirm({
                message: 'Do you want to delete this node?',
                header: 'Node Deletion Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
                    this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
                },
                reject: () => {
                    this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Node ${node.getName()} not deleted` });
                }
            });
        }
    }

    removeLink(link: joint.shapes.microtosca.RunTimeLink) {
        console.log("removing link called");
        console.log(this.confirmationService);
        this.confirmationService.confirm({
            message: 'Do you want to delete the link?',
            header: 'Link deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.graphInvoker.executeCommand(new RemoveLinkCommand(this.gs.getGraph(), link));
                //this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: `Node ${node.getName()} deleted succesfully` });
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Link not deleted` });
            }
        });

    }

    bindSingleClickBlank() {
        this.paper.on("blank:pointerclick", (cellView, evt, x, y, ) => {
            console.log("click on blank");
            if (this.leftClickselectdNode) {
                this.paper.findViewByModel(this.leftClickselectdNode).unhighlight();
                this.leftClickselectdNode = null;
            }
        });
    }

    bindSingleRightClickCell(){
        this.paper.on('element:contextmenu',(cellView, evt, x, y)=>{ 
            console.log("right click cell");
        })
        

    }

    bindSingleClickCell() {
        this.paper.on("element:pointerclick", (cellView, evt, x, y) => {
            console.log("click on cell");
            evt.preventDefault();
            evt.stopPropagation()
            var node = cellView.model;
            // team group cannot be clicked (both as source and target)
            if (!this.gs.getGraph().isTeamGroup(node)) {
                // selecting target node
                if (this.leftClickselectdNode !== null && node.id !== this.leftClickselectdNode.id) {
                    var add_link = true;
                    // disable link from <any> to datastore
                    if (this.gs.getGraph().isEdgeGroup(node)) {
                        add_link = false;
                    }
                    // disable link from edge to datastore
                    if (this.gs.getGraph().isEdgeGroup(this.leftClickselectdNode) && this.gs.getGraph().isDatastore(node)) {
                        add_link = false;
                    }
                    // disable link from communication pattern to Datastore
                    if (this.gs.getGraph().isCommunicationPattern(this.leftClickselectdNode) && this.gs.getGraph().isDatastore(node))
                        add_link = false;
                    if (add_link) {
                        const ref = this.dialogService.open(DialogAddLinkComponent, {
                            data: {
                                source: this.leftClickselectdNode,
                                target: node
                            },
                            header: 'Add a link',
                            width: '50%'
                        });
                        ref.onClose.subscribe((data) => {
                            if (data) {
                                var command = new AddLinkCommand(this.gs.getGraph(), this.leftClickselectdNode.getName(), node.getName(), data.timeout, data.circuit_breaker, data.dynamic_discovery);
                                this.graphInvoker.executeCommand(command);
                                this.paper.findViewByModel(this.leftClickselectdNode).unhighlight();
                                this.leftClickselectdNode = null;
                            }
                        });
                        console.log("added link");
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Error adding link', detail: `Link from [${this.leftClickselectdNode.getName()}] to [${node.getName()}] cannot be created` });
                    }
                }
                else {
                    // selecting source node
                    var can_select_source_node = true;
                    // message broker cannot be source for a link
                    if (this.gs.getGraph().isMessageBroker(node)) {
                        can_select_source_node = false;
                    }
                    // message broker cannot be source for a link
                    if (this.gs.getGraph().isDatastore(node)) {
                        can_select_source_node = false;
                    }
                    if (can_select_source_node) {
                        cellView.highlight();
                        this.leftClickselectdNode = node;
                    }
                    else {
                        this.messageService.add({ severity: 'error', summary: 'Error adding link', detail: `[${node.getName()}] cannot be the source node of a link` });
                    }
                }
            }
        });
    }

    bindDoubleClickCell() {
        this.paper.on("cell:pointerdblclick", (cellView, evt, x, y, ) => {
            evt.preventDefault();
            evt.stopPropagation();
            console.log("Double click cell");
        });
    }

    bindClickDeleteNode() {
        // delete a node event
        this.paper.on("node:service:delete", (cellView, evt, x, y, ) => {
            evt.stopPropagation();
            var node = cellView.model;
            this.confirmationService.confirm({
                message: 'Do you want to delete this service?',
                header: 'Node Deletion Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
                    this.graphInvoker.executeCommand(new RemoveServiceCommand(this.gs.getGraph(), node.getName()));
                },
                reject: () => {
                    node.hideIcons();
                    this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Node ${node.getName()} not deleted` });
                }
            });

        })

        this.paper.on("node:communicationpattern:delete", (cellView, evt, x, y, ) => {
            evt.stopPropagation();
            var node = cellView.model;
            this.confirmationService.confirm({
                message: 'Do you want to delete this communication pattern?',
                header: 'Node Deletion Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.graphInvoker.executeCommand(new RemoveCommunicationPatternCommand(this.gs.getGraph(), node.getName()));
                },
                reject: () => {
                    node.hideIcons();
                    this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Communication pattern ${node.getName()} not deleted` });
                }
            });

        })

        this.paper.on("node:datastore:delete", (cellView, evt, x, y, ) => {
            evt.stopPropagation();
            var node = cellView.model;
            this.confirmationService.confirm({
                message: 'Do you want to delete this datastore?',
                header: 'Node Deletion Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // this.graphInvoker.executeCommand(new RemoveNodeCommand(this.gs.getGraph(), node))
                    this.graphInvoker.executeCommand(new RemoveDatastoreCommand(this.gs.getGraph(), node.getName()));
                },
                reject: () => {
                    node.hideIcons();
                    this.messageService.add({ severity: 'info', summary: 'Rejected', detail: `Datastore ${node.getName()} not deleted` });
                }
            });

        })
    }

    bindMouseOverNode() {
        this.paper.on("cell:mouseenter", (cellView, evt, x, y, ) => {
            evt.stopPropagation();
            var cell = cellView.model;
            if (cell.isElement()) {
                cell.showIcons();
            }
            else if (this.gs.getGraph().isTeamGroup(cell))
                cell.showIcons();

        })

        this.paper.on("cell:mouseleave", (cellView, evt, x, y, ) => {
            evt.stopPropagation();
            var cell = cellView.model;
            if (cell.isElement()) {
                cell.hideIcons()

            }
        })

    }

    bindClickOnSmells() {
        this.paper.on("smell:EndpointBasedServiceInteraction:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var model = cellview.model;
            var smell: SmellObject = model.getSmell("EndpointBasedServiceInterationSmell");
            this._openDialogSmellComponent(model, smell);
        })

        this.paper.on("smell:NoApiGateway:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var model = cellview.model;
            var smell: SmellObject = model.getSmell("NoAPiGatewaySmell");
            this._openDialogSmellComponent(model, smell);
        })

        this.paper.on("smell:SharedPersistency:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var model = cellview.model;
            var smell: SmellObject = model.getSmell("SharedPersistencySmell");
            this._openDialogSmellComponent(model, smell);
        })

        this.paper.on("smell:WobblyServiceInteractionSmell:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var model: joint.shapes.microtosca.Node = cellview.model;
            var smell: SmellObject = model.getSmell("WobblyServiceInteractonSmell");
            this._openDialogSmellComponent(model, smell);
        })

        this.paper.on("smell:SingleLayerTeam:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var model = cellview.model;
            var smell: SmellObject = model.getSmell("SingleLayerTeamSmell");
            this._openDialogSmellComponent(model, smell);
        })
    }

    _openDialogSmellComponent(node: joint.shapes.microtosca.Node, smell: SmellObject) {
        const ref = this.dialogService.open(DialogSmellComponent, {
            data: {
                model: node,
                selectedsmell: smell
            },
            header: `Smell details`,
            width: '60%'
        });

        ref.onClose.subscribe((refactoringCommand) => {
            if (refactoringCommand) {
                this.graphInvoker.executeCommand(refactoringCommand);
                this.messageService.add({ severity: 'success', summary: "Refactoring applied correctly" });
            }
        });
    }


    bindTeamEmbedNodes() {
        // First, unembed the cell that has just been grabbed by the user.
        // this.paper.on('cell:pointerdown', (cellView, evt, x, y) => {

        //     var cell = cellView.model;

        //     if (!cell.get('embeds') || cell.get('embeds').length === 0) {
        //         // Show the dragged element above all the other cells (except when the
        //         // element is a parent).
        //         cell.toFront();
        //     }

        //     if (cell.get('parent')) {
        //         //unembed cell from the parent
        //         // var member = <joint.shapes.microtosca.Node>cell;
        //         // var team = this.gs.getGraph().getTeamOfNode(member);
        //         // var command = new RemoveMemberFromTeamGroupCommand(this.gs.getGraph(), team.getName(), member.getName());
        //         // this.graphInvoker.executeCommand(command);
        //         // this.messageService.add({ severity: 'success', summary: 'Member removed from to team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
        //     }
        // });

        // When the dragged cell is dropped over another cell, let it become a child of the
        // element below.
        this.paper.on('cell:pointerup', (cellView, evt, x, y) => {
            var cell = cellView.model;
            if (!cell.isLink()) { // otherwise Error when cell.getBBox() is called.

                var cellViewsBelow = this.paper.findViewsFromPoint(cell.getBBox().center());

                if (cellViewsBelow.length) {
                    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
                    var cellViewBelow = _.find(cellViewsBelow, function (c) { return c.model.id !== cell.id });
                    console.log(cellViewBelow);
                    // Prevent recursive embedding
                    if (cellViewBelow) {
                        // embed element only into Team Cell, otherwise it embeds node inside other nodes.
                        if (this.gs.getGraph().isTeamGroup(cellViewBelow.model)) {
                            // check if the elment below has the parent equal to the cell
                            if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
                                var team = <joint.shapes.microtosca.SquadGroup>cellViewBelow.model;
                                var member = <joint.shapes.microtosca.Node>cell;
                                var memberTeam = this.gs.getGraph().getTeamOfNode(member);
                                console.log(memberTeam);
                                // do not embed on the same team
                                if(team && memberTeam && team.getName() == memberTeam.getName() ){
                                    team.fitEmbeds({ padding: 40});
                                }
                                else {
                                    var command = new AddMemberToTeamGroupCommand(this.gs.getGraph(), team.getName(), member.getName());
                                    this.graphInvoker.executeCommand(command);
                                    this.messageService.add({ severity: 'success', summary: 'Member added to  team', detail: `Node [${member.getName()}] added to [${team.getName()}] team` });
                                }
                            }
                        }
                        
                    }else{
                        // click on blank paper
                        console.log("not cell view Below defined");
                        var member = <joint.shapes.microtosca.Node>cell;
                        var team = this.gs.getGraph().getTeamOfNode(member);
                        if(team){
                            var command = new RemoveMemberFromTeamGroupCommand(this.gs.getGraph(), team.getName(), member.getName());
                             this.graphInvoker.executeCommand(command);
                             this.messageService.add({ severity: 'success', summary: 'Member removed from team', detail: `Node [${member.getName()}] removed to [${team.getName()}] team` });
                        }
                        
                    }
                }
            }

        });
    }

    bindTeamMaximize() {
        this.paper.on("team:maximize:pointerdown", (cellview, evt, x, y) => {
            console.log("maximize");
            evt.stopPropagation();
            var team = <joint.shapes.microtosca.SquadGroup>cellview.model;
            this.gs.getGraph().maximizeTeam(team);
        })
    }

    bindTeamMinimize() {
        this.paper.on("team:minimize:pointerdown", (cellview, evt, x, y) => {
            evt.stopPropagation();
            var team = <joint.shapes.microtosca.SquadGroup>cellview.model;
            this.gs.getGraph().minimizeTeam(team);
        })
    }

    bindTeamToCoverChildren() {

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

        this.gs.getGraph().on('change:position', (cell, newPosition, opt) => {

            if (opt.skipParentHandler) return;

            if (cell.get('embeds') && cell.get('embeds').length) {
                // If we're manipulating a parent element, let's store
                // it's original position to a special property so that
                // we can shrink the parent element back while manipulating
                // its children.
                cell.set('originalPosition', cell.get('position'));
            }

            // DIDO
            // var parentId = cell.get('parent');
            // console.log(cell.attr);
            // if (!parentId) return;

            // var parent = this.gs.getGraph().getCell(parentId);
            /// DIDO
            var parent = cell.getParentCell();

            if (!parent) return;

            var parentBbox = parent.getBBox();
            // var parentBbox = this.gs.getGraph().getBBox([parent]);

            if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
            if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));

            var originalPosition = parent.get('originalPosition');
            var originalSize = parent.get('originalSize');

            var newX = originalPosition.x;
            var newY = originalPosition.y;
            var newCornerX = originalPosition.x + originalSize.width;
            var newCornerY = originalPosition.y + originalSize.height;

            _.each(parent.getEmbeddedCells(), (child) => {
                var childBbox = (<joint.dia.Element>child).getBBox();
                // var childBbox = this.gs.getGraph().getCell(child);

                if (childBbox.x < newX) { newX = childBbox.x; }
                if (childBbox.y < newY) { newY = childBbox.y; }
                if (childBbox.corner().x > newCornerX) { newCornerX = childBbox.corner().x; }
                if (childBbox.corner().y > newCornerY) { newCornerY = childBbox.corner().y; }
            });

            // Note that we also pass a flag so that we know we shouldn't adjust the
            // `originalPosition` and `originalSize` in our handlers as a reaction
            // on the following `set()` call.
            parent.set({
                position: { x: newX, y: newY },
                size: { width: newCornerX - newX, height: newCornerY - newY }
            }, { skipParentHandler: true });

        });
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

    // bindCreateLink() {
    //     // Create a new link by dragging
    //     this.paper.on('blank:pointerdown', function (evt, x, y) {
    //         var link = new joint.shapes.standard.Link();
    //         link.set('source', { x: x, y: y });
    //         link.set('target', { x: x, y: y });
    //         link.addTo(this.model);
    //         evt.data = { link: link, x: x, y: y };
    //     })

    //     this.paper.on('blank:pointermove', function (evt, x, y) {
    //         evt.data.link.set('target', { x: x, y: y });
    //     });

    //     this.paper.on('blank:pointerup', function (evt) {
    //         var target = evt.data.link.get('target');
    //         if (evt.data.x === target.x && evt.data.y === target.y) {
    //             // remove zero-length links
    //             evt.data.link.remove();
    //         }
    //     });
    // }

    bindMouseEnterLink() {
        this.paper.on('link:mouseenter', (linkView) => {
            var tools = [
                // new joint.linkTools.SourceArrowhead(),
                // new joint.linkTools.TargetArrowhead(),
                new joint.linkTools.Vertices({
                    snapRadius: 0,
                    redundancyRemoval: false,
                    vertexAdding: false
                }),
                new joint.linkTools.TargetAnchor(),
                // new joint.linkTools.Remove(),
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
                // button remove a link
                new joint.linkTools.Button({
                    markup: [{
                        tagName: 'circle',
                        selector: 'button',
                        attributes: {
                            'r': 7,
                            'fill': '#FF1D00',
                            'cursor': 'pointer'
                        }
                    }, {
                        tagName: 'path',
                        selector: 'icon',
                        attributes: {
                            'd': 'M -3 -3 3 3 M -3 3 3 -3',
                            'fill': 'none',
                            'stroke': '#FFFFFF',
                            'stroke-width': 2,
                            'pointer-events': 'none'
                        }
                    }],
                    distance: 60,
                    offset: 0,
                    action: () => {
                        console.log("Deleting link");
                        this.removeLink(linkView.model);
                    }
                })
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
