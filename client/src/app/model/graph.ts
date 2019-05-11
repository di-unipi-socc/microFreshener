import { EventEmitter } from '@angular/core';
import * as joint from 'jointjs';
import './microtosca';
import { group } from '@angular/animations';

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

    getNode(name: string | joint.dia.Element): joint.shapes.microtosca.Node {
        for (let node of this.getElements()) {
            if ((<joint.shapes.microtosca.Node>node).getName() == name)
                return <joint.shapes.microtosca.Node>node;
        }
        return null;
    }

    getGroup(name: string): joint.shapes.microtosca.Group {
        return this.getGroups().find(group => group.getName() == name);
    }

    getRoots(): joint.shapes.microtosca.Root[] {
        return <joint.shapes.microtosca.Root[]>this.getElements();
    }

    /**Return all the nodes in the graph  */
    getNodes(): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getElements().filter(node => this.isNode(node));
    }

    /**Return all the group in the graph  */
    getGroups(): joint.shapes.microtosca.Group[] {
        return <joint.shapes.microtosca.Group[]>this.getElements().filter(node => this.isGroup(node));
    }

    findNodeByName(name: string): joint.shapes.microtosca.Node {
        return this.getNodes().find(node => name === node.getName());
    }

    findGroupByName(name: string): joint.shapes.microtosca.Group {
        return this.getGroups().find(group => name === group.getName());
    }

    findRootByName(name: string): joint.shapes.microtosca.Root {
        return this.getRoots().find(element => name === element.getName());
    }

    removeNode(name: string) {
        return this.getNode(name).remove();
    }

    getLinks(): joint.shapes.microtosca.RunTimeLink[] {
        return <joint.shapes.microtosca.RunTimeLink[]>super.getLinks().filter(link => !this.isGroup(link.getSourceElement()));
    }

    getLinkFromSourceToTarget(source: joint.shapes.microtosca.Node, target: joint.shapes.microtosca.Node): joint.shapes.microtosca.RunTimeLink {
        return (<joint.shapes.microtosca.RunTimeLink[]>super.getLinks()).find(link => {
            var s: string = (<joint.shapes.microtosca.Node>link.getSourceElement()).getName();
            var t: string = (<joint.shapes.microtosca.Node>link.getTargetElement()).getName();
            return s === source.getName() && t === target.getName();
        });
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

    getSquadGroups(): joint.shapes.microtosca.SquadGroup[] {
        return <joint.shapes.microtosca.SquadGroup[]>this.getGroups().filter(group => this.isSquadGroup(group));
    }

    getOutboundNeighbors(node: joint.dia.Element): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getNeighbors(node, { outbound: true });
    }

    getInboundNeighbors(client: joint.shapes.microtosca.Node): joint.shapes.microtosca.Node[] {
        return <joint.shapes.microtosca.Node[]>this.getNeighbors(client, { inbound: true });
    }

    getOutgoingLinks(node: joint.shapes.microtosca.Node) {
        return <joint.shapes.microtosca.RunTimeLink[]>this.getConnectedLinks(node, { outbound: true });
    }

    getIngoingLinks(node: joint.shapes.microtosca.Node) {
        return <joint.shapes.microtosca.RunTimeLink[]>this.getConnectedLinks(node, { inbound: true });
    }

    addSquadGroup(name: string, nodes: joint.shapes.microtosca.Node[]): joint.shapes.microtosca.SquadGroup {
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
        database.resize(75, 100);
        database.position(525, 75);
        database.topRy('20%');
        database.setName(name);
        database.addTo(this);
        return database;
    }

    addCommunicationPattern(name: string, type: string): joint.shapes.microtosca.CommunicationPattern {
        let cp = new joint.shapes.microtosca.CommunicationPattern();
        cp.setName(name);
        cp.setConcreteType(type);
        cp.addTo(this);
        return cp;
    }

    addApiGateway(name: string): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "ApiGateway");
    }

    addMessageRouter(name: string): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "MessageRouter");
    }

    addMessageBroker(name: string): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "MessageBroker");
    }

    addServiceDiscovery(name: string): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "ServiceDiscovery");
    }

    addCircuitBreaker(name: string): joint.shapes.microtosca.CommunicationPattern {
        return this.addCommunicationPattern(name, "CircuitBreaker");
    }

    addRunTimeInteraction(source: joint.shapes.microtosca.Node, target: joint.shapes.microtosca.Node, timedout: boolean = false, with_circuit_breaker:boolean=false, with_dynamic_discovery:boolean=false): joint.shapes.microtosca.RunTimeLink {

        let alredyExistingLink = this.getLinkFromSourceToTarget(source, target);
        if (alredyExistingLink)
            return alredyExistingLink;
        else {
            var link = new joint.shapes.microtosca.RunTimeLink({
                source: { id: source.id },
                target: { id: target.id },
            });
            link.setTimedout(timedout);
            link.setCircuitBreaker(with_circuit_breaker);
            link.setDynamicDiscovery(with_dynamic_discovery);
            this.addCell(link);
            return link;
        }
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
            else if (node.type == "communicationpattern") {
                var concrete_type = node["ctype"];
                this.addCommunicationPattern(node.name, concrete_type);
            }
            else
                throw new Error(`Node type of ${node.name} not recognized`);
        });
        json['links'].forEach((link) => {
            if (link.type == "deploymenttime")
                this.addDeploymentTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']));
            else if (link.type = "runtime") {
                this.addRunTimeInteraction(this.findNodeByName(link['source']), this.findNodeByName(link['target']), link['timeout']);
            }

        });
        json['groups'].forEach(group => {
            let group_name = group['name'];
            let group_type = group['type'];
            if (group_type == "edgegroup") {
                let nodes: joint.shapes.microtosca.Node[] = [];
                group.members.forEach(member => {
                    nodes.push(this.getNode(member))
                });
                this.addEdgeGroup(group_name, nodes);
            }
            else if (group_type == "squadgroup") {
                let nodes: joint.shapes.microtosca.Node[] = [];
                group.members.forEach(member => {
                    nodes.push(this.getNode(member))
                });
                this.addSquadGroup(group_name, nodes);
            }
            else
                throw new Error(`Group type ${group_type} not recognized`);

        })
    }

    toJSON() {
        var data: Object = { 'name': this.name, 'nodes': [], 'links': [], 'groups': [] };
        this.getNodes().forEach((node: joint.shapes.microtosca.Node) => {

            var dnode = { 'name': node.getName() }; // 'id': node.get('id'),
            if (this.isService(node))
                dnode['type'] = "service";
            else if (this.isDatabase(node))
                dnode['type'] = "database";
            else if (this.isCommunicationPattern(node)) {
                dnode['type'] = "communicationpattern"
                dnode['ctype'] = (<joint.shapes.microtosca.CommunicationPattern>node).getConcreteType();
            }
            else
                throw new Error(`Node type of ${dnode} not recognized`);
            data['nodes'].push(dnode);
        })
        // Add links
        this.getLinks().forEach((link: joint.shapes.microtosca.RunTimeLink) => {
            var dlink = {
                'source': (<joint.shapes.microtosca.Node>link.getSourceElement()).getName(),
                'target': (<joint.shapes.microtosca.Node>link.getTargetElement()).getName(),
                'timeout': link.hasTimeout()
            }
            if (link instanceof joint.shapes.microtosca.RunTimeLink)
                dlink['type'] = "runtime";
            else if (<any>link instanceof joint.shapes.microtosca.DeploymentTimeLink)
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
        // add SquadGroups
        this.getSquadGroups().forEach(group =>{
            var squadGroup = { 'name': group.getName(), 'type': 'squadgroup', "members": [] }
            let members = [];
            group.getEmbeddedCells().forEach(cell=>{
                members.push((<joint.shapes.microtosca.Node>cell).getName());
            });
            squadGroup['members'] = members;
            data['groups'].push(squadGroup);
        })
        return data;
    }

    applyLayout(rankdir: string) {
        var nodeSepator = 50;
        var edgeSepator = 50;
        var rankSeparator = 50;
        var setVertices = false;
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
