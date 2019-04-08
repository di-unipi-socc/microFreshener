import { EventEmitter } from '@angular/core';
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

    getNode(name: string): joint.shapes.microtosca.Node {
        for (let node of this.getElements()) {
            if ((<joint.shapes.microtosca.Node>node).getName() == name)
                return <joint.shapes.microtosca.Node>node;
        }
        return null;
    }

    getGroup(name: string): joint.shapes.microtosca.Group {
        return this.getGroups().find(group => group.getName() == name);
    }

    /**Return all the nodes in the graph  */
    getNodes(): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getElements().filter(node => this.isNode(node));
        // return <joint.shapes.microtosca.Node[]>this.getElements().filter((node) => {
        //     return <joint.shapes.microtosca.Node>node instanceof joint.shapes.microtosca.Node;
        // })
    }

    /**Return all the group in the graph  */
    getGroups(): joint.shapes.microtosca.Group[] {
        return <joint.shapes.microtosca.Group[]>this.getElements().filter(node => this.isGroup(node));
    }

    findNodeByName(name: string): joint.dia.Cell {
        return this.getNodes().find(node => {
            return name === this.getNameOfNode(node);
        });
    }

    getNameOfNode(node: joint.dia.Cell) {
        return node.attr("label/text");
    }


    removeNode(name: string) {
        return this.getNode(name).remove();
    }

    getLinks(): joint.dia.Link[] {
        return super.getLinks().filter(link => !this.isGroup(link.getSourceElement()));
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

    getEdgeGroups(): joint.shapes.microtosca.EdgeGroup[] {
        return <joint.shapes.microtosca.EdgeGroup[]>this.getGroups().filter(group => this.isEdgeGroup(group));
    }

    getOutboundNeighbors(client: joint.dia.Cell):joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getNeighbors(client, { outbound: true });
    }

    addTeamGroup(name: string, nodes: joint.shapes.microtosca.Node[]): joint.shapes.microtosca.SquadGroup {
        let g = new joint.shapes.microtosca.SquadGroup();
        g.setName(name);
        g.addTo(this);
        nodes.forEach(node => {
            g.embed(node);
           
        });
        return g;
    }

    addEdgeGroup(name: string, nodes: joint.shapes.microtosca.Node[]) {
        let g = new joint.shapes.microtosca.EdgeGroup();
        g.setName(name);
        g.setExternalUserName("Ext user"); // default name for the external user node
        g.addTo(this);
        nodes.forEach(node => {
            this.addRunTimeInteraction(g, node);
        });
        return g;
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

    isNode(node: joint.dia.Cell): boolean {
        return this.isService(node) || this.isDatabase(node) || this.isCommunicationPattern(node);
    }

    isGroup(group: joint.dia.Cell): boolean {
        return this.isSquadGroup(group) || this.isEdgeGroup(group);
    }

    isSquadGroup(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.SquadGroup";
        // return node instanceof joint.shapes.microtosca.SquadGroup;
    }

    isEdgeGroup(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.EdgeGroup";
        // return node instanceof joint.shapes.microtosca.Group;
    }

    isService(node: joint.dia.Cell): boolean {
        return node.attributes['type'] == "microtosca.Service";
        // return node instanceof joint.shapes.microtosca.Service;
    }

    isDatabase(node: joint.dia.Cell): boolean {
        return node.attributes['type'] == "microtosca.Database";
        // return node instanceof joint.shapes.microtosca.Database;
    }

    isCommunicationPattern(node: joint.dia.Cell) {
        return node.attributes['type'] == "microtosca.CommunicationPattern";
        // return node instanceof joint.shapes.microtosca.CommunicationPattern;
    }

    builtFromJSON(json: string) {

        this.removeCells(this.getCells());
        // var g = new Graph(json['name']);
        this.name = json['name'];
        json['nodes'].forEach(node => {
            if (node.type == "service")
                this.addService(node.name)
            else if (node.type == "database")
                this.addDatabase(node.name);
            else if (node.type == "communicationpattern")
                this.addCommunicationPattern(node.name, node.type);
            else
                // TODO: thorow an exception
                console.log("ERROR: node type not recognized");
        });
        json['links'].forEach((link) => {
            if (link.type == "deploymenttime")
                this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            else if (link.type = "runtime")
                this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
        });
        json['groups'].forEach(group => {
            let group_name = group['name'];
            if (group['type'] == "edgegroup") {
                let nodes: joint.shapes.microtosca.Node[] = [];
                group.members.forEach(member => {
                    nodes.push(this.getNode(member))
                });
                this.addEdgeGroup(group_name, nodes);
            }

        })
    }

    toJSON() {
        var data: Object = { 'name': this.name, 'nodes': [], 'links': [], 'groups': [] };
        // TODO: node can be of type joint.microtosca.Node insted fo Cell
        this.getNodes().forEach((node: joint.shapes.microtosca.Node) => {
            var dnode = { 'name': node.getName() }; // 'id': node.get('id'),
            if (this.isService(node))
                dnode['type'] = "service";
            else if (this.isDatabase(node))
                dnode['type'] = "database";
            else if (this.isCommunicationPattern(node))
                dnode['type'] = "communicationpattern";
            else
                // TODO: throw an exception
                throw new Error(`Node type of ${dnode} not recognized`);
            data['nodes'].push(dnode);
        })
        // Add links
        this.getLinks().forEach((link) => {
            var dlink = {
                'source': this.getNameOfNode(link.getSourceElement()), 
                'target': this.getNameOfNode(link.getTargetElement()) 
            }
            // if (link.get('type') === 'microtosca.RunTimeLink')
            if (link instanceof joint.shapes.microtosca.RunTimeLink)
                dlink['type'] = "runtime";
            else if (link instanceof joint.shapes.microtosca.DeploymentTimeLink)
                dlink['type'] = "deploymenttime";
            else
                throw new Error(`Link type of ${link} not recognized`);
            data['links'].push(dlink);
        })
        // Add EdgeGroups
        this.getEdgeGroups().forEach(node => {
            var edgeGroup = { 'name': node.getName(), 'type': 'edgegroup', "members": [] }; // 'id': node.get('id'),
            let members = [];
            this.getOutboundNeighbors(node).forEach(neigbor => {
                members.push((<joint.shapes.microtosca.Node>neigbor).getName());
            })
            edgeGroup['members'] = members;
            data['groups'].push(edgeGroup)
        });
        console.log(data['groups']);

        return data;
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
