import { Command } from './icommand';
import * as joint from 'jointjs';
import { g } from 'jointjs';
import { Graph } from "../graph/model/graph";


export abstract class NodeCommand<T extends joint.shapes.microtosca.Node> implements Command {
    
    abstract execute();
    abstract unexecute();

    protected node: T;

    setNode(node: T) {
        this.node = node;
    }

    getNode(): T {
        return this.node;
    }

    constructor(node?: T) {
        this.node = node;
    }

    then(next: NodeCommand<T>): NodeCommand<T> {
        let action = () => {this.execute()};
        let revert = () => {this.unexecute()};
        let getNode = () => { return this.getNode() };
        return new class extends NodeCommand<T> {
            execute() {
                action();
                let node = getNode();
                next.setNode(node);
                next.execute();
            }
            unexecute() {
                next.unexecute();
                revert();
            }
        };
    }
}


abstract class NodeGeneratorCommand<T extends joint.shapes.microtosca.Node> extends NodeCommand<T> {

    name: string;
    position?: g.Point;

    constructor(name: string, position?: g.Point) {
        super();
        this.name = name;
        this.position = position;
    }

    protected abstract generateNode(): T;

    execute() {
        this.node = this.generateNode();
    }

    unexecute() {
        this.node.remove();
    }
}

export class AddServiceCommand extends NodeGeneratorCommand<joint.shapes.microtosca.Service> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addService(this.name, this.position);
    }
}

export class AddDatastoreCommand extends NodeGeneratorCommand<joint.shapes.microtosca.Datastore> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addDatastore(this.name, this.position);
    }
}

export class AddMessageBrokerCommand extends NodeGeneratorCommand<joint.shapes.microtosca.CommunicationPattern> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addMessageBroker(this.name, this.position);
    }
}

export class AddMessageRouterCommand extends NodeGeneratorCommand<joint.shapes.microtosca.CommunicationPattern> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addMessageRouter(this.name, this.position);
    }
}

export class RemoveNodeCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    teamOfNode: joint.shapes.microtosca.SquadGroup;

    cloneNode: joint.shapes.microtosca.Root;
    incomingNodes: joint.shapes.microtosca.Root[];
    outcomingNodes: joint.shapes.microtosca.Root[];

    constructor(graph: Graph, node: joint.shapes.microtosca.Root) {
        this.graph = graph;
        this.node = node;
        // TODO get the team of the node in order to restore in into the team when redo
        this.teamOfNode = graph.getTeamOfNode(node);
        this.cloneNode = <joint.shapes.microtosca.Root>node.clone();
        this.incomingNodes = this.graph.getInboundNeighbors(this.node);
        this.outcomingNodes = this.graph.getOutboundNeighbors(this.node);
    }

    execute() {
        this.node.remove();
    }

    unexecute() {
        if (this.node instanceof joint.shapes.microtosca.Service)
            this.node = this.graph.addService(this.cloneNode.getName());
        else if (this.node instanceof joint.shapes.microtosca.Datastore)
            this.node = this.graph.addDatastore(this.cloneNode.getName());
        else if (this.node instanceof joint.shapes.microtosca.CommunicationPattern)
            this.node = this.graph.addCommunicationPattern(this.cloneNode.getName(), (<joint.shapes.microtosca.CommunicationPattern>this.cloneNode).getType());

        this.incomingNodes.forEach(inNode => {
            this.graph.addRunTimeInteraction(inNode, this.node);
        })
        this.outcomingNodes.forEach(outNode => {
            this.graph.addRunTimeInteraction(this.node, outNode);
        })
        this.teamOfNode.addMember(this.node);
    }
}

export class RemoveServiceCommand implements Command {

    graph: Graph;
    node_name: string;

    team_name: string = null;

    incoming_links = new Map();
    outcoming_links = new Map();

    constructor(graph: Graph, node_name: string) {
        this.graph = graph;
        this.node_name = node_name;
      
        var node = this.graph.getNode(node_name)
        if(graph.getTeamOfNode(node))
            this.team_name = graph.getTeamOfNode(node).getName();

         this.graph.getIngoingLinks(node).forEach(link =>{
            var source_name = (<joint.shapes.microtosca.Node>link.getSourceElement()).getName();
            var t =  [link.hasTimeout(), link.hasCircuitBreaker(), link.hasCircuitBreaker()];
            this.incoming_links.set(source_name, t);
        });
        this.graph.getOutgoingLinks(node).forEach(link =>{
            var target_name = (<joint.shapes.microtosca.Node>link.getTargetElement()).getName();
            var t =  [link.hasTimeout(), link.hasCircuitBreaker(), link.hasCircuitBreaker()];
            this.outcoming_links.set(target_name, t);
        });

    }

    execute() {
        this.graph.removeNode(this.node_name);
    }

    unexecute() {
        var node = this.graph.addService(this.node_name);

        this.incoming_links.forEach((value, key)=>{
            var source = this.graph.getNode(key);
            this.graph.addRunTimeInteraction(source, node, value[0], value[1], value[2]);
        });
        
        this.outcoming_links.forEach((value, key)=>{
            var target = this.graph.getNode(key);
            this.graph.addRunTimeInteraction(node, target, value[0], value[1], value[2]);
        });
       
        if(this.team_name)
            this.graph.getTeam(this.team_name).addMember(node);
    }
}

export class RemoveDatastoreCommand implements Command {

    graph: Graph;
    node_name: string;

    team_name: string = null;

    incoming_links = new Map();

    constructor(graph: Graph, node_name: string) {
        this.graph = graph;
        this.node_name = node_name;
      
        var node = this.graph.getNode(node_name)
        if(graph.getTeamOfNode(node))
            this.team_name = graph.getTeamOfNode(node).getName();

         this.graph.getIngoingLinks(node).forEach(link =>{
            var source_name = (<joint.shapes.microtosca.Node>link.getSourceElement()).getName();
            var t =  [link.hasTimeout(), link.hasCircuitBreaker(), link.hasCircuitBreaker()];
            this.incoming_links.set(source_name, t);
        });

    }

    execute() {
        this.graph.removeNode(this.node_name);
    }

    unexecute() {
        var node = this.graph.addDatastore(this.node_name);

        this.incoming_links.forEach((value, key)=>{
            var source = this.graph.getNode(key);
            this.graph.addRunTimeInteraction(source, node, value[0], value[1], value[2]);
        });
       
        if(this.team_name)
            this.graph.getTeam(this.team_name).addMember(node);
    }
}

export class RemoveCommunicationPatternCommand implements Command {

    graph: Graph;
    node_name: string;
    type_node: string;
    team_name: string = null;

    incoming_links = new Map();
    outcoming_links = new Map();


    constructor(graph: Graph, node_name: string) {
        this.graph = graph;
        this.node_name = node_name;
      
        var node = this.graph.getNode(node_name);
        this.type_node  = (<joint.shapes.microtosca.CommunicationPattern>node).getType();

        if(graph.getTeamOfNode(node))
            this.team_name = graph.getTeamOfNode(node).getName();

         this.graph.getIngoingLinks(node).forEach(link =>{
            var source_name = (<joint.shapes.microtosca.Node>link.getSourceElement()).getName();
            var t =  [link.hasTimeout(), link.hasCircuitBreaker(), link.hasCircuitBreaker()];
            this.incoming_links.set(source_name, t);
        });

        this.graph.getOutgoingLinks(node).forEach(link =>{
            var target_name = (<joint.shapes.microtosca.Node>link.getTargetElement()).getName();
            var t =  [link.hasTimeout(), link.hasCircuitBreaker(), link.hasCircuitBreaker()];
            this.outcoming_links.set(target_name, t);
        });


    }

    execute() {
        this.graph.removeNode(this.node_name);
    }

    unexecute() {
        var node = this.graph.addCommunicationPattern(this.node_name, this.type_node);

        this.incoming_links.forEach((value, key)=>{
            var source = this.graph.getNode(key);
            this.graph.addRunTimeInteraction(source, node, value[0], value[1], value[2]);
        });

        this.outcoming_links.forEach((value, key)=>{
            var target = this.graph.getNode(key);
            this.graph.addRunTimeInteraction(node, target, value[0], value[1], value[2]);
        });
       
        if(this.team_name)
            this.graph.getTeam(this.team_name).addMember(node);
    }
}