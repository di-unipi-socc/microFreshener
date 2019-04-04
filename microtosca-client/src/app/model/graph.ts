import { EventEmitter, Output } from '@angular/core';

import * as joint from 'jointjs';
import './microtosca';

export class Graph extends joint.dia.Graph {
    name: string;
    public ticker: EventEmitter<Number> = new EventEmitter();
    // public ticker: EventEmitter<number> = new EventEmitter();

    constructor(name: string) {
        super();
        this.name = name;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getNode(id: string | number): joint.shapes.microtosca.Node {
        return <joint.shapes.microtosca.Node>this.getCell(id);
    }

    /**Return all the nodes in the graph (without the ExternalUser node) */
    getNodes(): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getCells().filter(node => !node.isLink() && !this.isExternalUser(node));
    }

    findNodeByName(name: string): joint.dia.Cell {
        return this.getNodes().find(node => {
            console.log("finding" + this.getNameOfNode(node));
            return name === this.getNameOfNode(node)
        });
    }

    getNameOfNode(node: joint.dia.Cell) {
        return node.attr("label/text");
    }

    builtFromJSON(json: string) {

        this.removeCells(this.getCells());
        // var g = new Graph(json['name']);
        console.log("removed cells");
        this.name = json['name'];
        json['nodes'].forEach(node => {
            if (node.type == "service")
                this.addService(node.name)
            if (node.type == "database")
                this.addDatabase(node.name);
            if (node.type == "communicationpattern")
                this.addCommunicationPattern(node.name, node.type);
        });
        json['links'].forEach((link) => {
            if (link.type == "deploymenttime")
                this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            if (link.type = "runtime")
                this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));

        });
    }

    toJSON() {
        var data: Object = { 'name': this.name, 'nodes': [], 'links': [] };
        // TODO: node can be of type joint.microtosca.Node insted fo Cell
        this.getNodes().forEach((node: joint.dia.Cell) => {
            if (!this.isExternalUser(node)) { // external user node
                var dnode = { 'id': node.get('id'), 'name': this.getNameOfNode(node) };
                if (this.isService(node))
                    dnode['type'] = "service";
                if (this.isDatabase(node))
                    dnode['type'] = "database";
                if (this.isCommunicationPattern(node))
                    dnode['type'] = "communicationpattern";
                data['nodes'].push(dnode);
            }else{
                console.log("EXTERNAL USER FOUND");
            }


        })

        this.getLinks().forEach((link) => {
            var dlink = {
                'source': link.getSourceElement().get('id'),
                'target': link.getTargetElement().get('id'),
            }
            if (link.get('type') === 'microtosca.RunTimeLink')
                dlink['type'] = "runtime";
            if (link.get('type') === 'microtosca.DeploymentTimeLink')
                dlink['type'] = "deploymenttime";
            data['links'].push(dlink);
        })

        return data;
    }

    removeNode(id: string | number) {
        return this.getNode(id).remove();
    }

    getLinks(): joint.dia.Link[] {

        return super.getLinks();// .filter(node => node.isLink());
    }

    getServices(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isService(node));
    }

    getDatabase(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isDatabase(node));
    }

    getCommunicationPattern(): joint.dia.Cell[] {
        return this.getNodes().filter(node => this.isCommunicationPattern(node));
    }

    addExternaluser(name: string): joint.shapes.microtosca.ExternalUser {
        let extuser = new joint.shapes.microtosca.ExternalUser();
        extuser.setName(name);
        extuser.addTo(this);
        return extuser;
    }

    addService(name: string): joint.shapes.microtosca.Service {
        let service = new joint.shapes.microtosca.Service();
        service.setName(name);
        service.addTo(this);
        return service;
    }

    addDatabase(name: string): joint.shapes.microtosca.Database {
        let database = new joint.shapes.microtosca.Database();
        database.setName(name);
        database.addTo(this);
        return database;
    }

    addCommunicationPattern(name: string, type: string): joint.shapes.microtosca.CommunicationPattern {
        let cp = new joint.shapes.microtosca.CommunicationPattern();
        cp.setName(name);
        cp.setType(type);
        cp.addTo(this);
        return cp;
    }

    addRunTimeInteraction(source: joint.dia.Cell, target: joint.dia.Cell): joint.shapes.standard.Link {
        var link = new joint.shapes.microtosca.RunTimeLink({
            source: { id: source.id },
            target: { id: target.id },
        });
        this.addCell(link);
        return link;
    }

    addDeploymentTimeInteraction(source: joint.dia.Cell, target: joint.dia.Cell): joint.shapes.standard.Link {
        var link = new joint.shapes.microtosca.DeploymentTimeLink({
            source: { id: source.id },
            target: { id: target.id },
        });
        this.addCell(link);
        return link;
    }

    isExternalUser(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.ExternalUser';
    }

    isService(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.Service';
    }

    isDatabase(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.Database';
    }

    isCommunicationPattern(node: joint.dia.Cell) {
        return node.get('type') === 'microtosca.CommunicationPattern';
    }

    applyLayout(rankdir: string) {
        var nodeSepator = 50;
        var edgeSepator = 50;
        var rankSeparator = 50;
        var setVertices = true;
        // rankdir: one of "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left))
        switch (rankdir) {
            case "TB": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "TB",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "BT": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "BT",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "LR": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "LR",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            case "RL": {
                joint.layout.DirectedGraph.layout(this, {
                    nodeSep: nodeSepator,
                    edgeSep: edgeSepator,
                    rankSep: rankSeparator,
                    rankDir: "RL",
                    setVertices: setVertices,
                    ranker: "longest-path",
                    marginY: 100,
                    marginX: 100,
                });
                break;
            }
            default: {
                break;
            }
        }

    }

}
