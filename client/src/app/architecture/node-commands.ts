import { Command, CompositeCommand, ElementCommand } from '../commands/icommand';
import * as joint from 'jointjs';
import { g } from 'jointjs';
import { Graph } from "../graph/model/graph";
import { RemoveMemberFromTeamGroupCommand } from '../teams/team-commands';
import { RemoveLinkCommand } from './link-commands';


export abstract class NodeGeneratorCommand<T extends joint.shapes.microtosca.Node> extends ElementCommand<T> {

    name: string;
    position?: g.Point;

    constructor(name: string, position?: g.Point) {
        super(undefined);
        this.name = name;
        this.position = position;
    }

    protected abstract generateNode(): T;

    execute() {
        this.set(this.generateNode());
    }

    unexecute() {
        this.get().remove();
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

export class RemoveNodeCommand<T extends joint.shapes.microtosca.Node> extends ElementCommand<T> {

    graph: Graph;
    removeNodeFromEverything: Command;

    constructor(graph: Graph, node?: T) {
        super(node);
        this.graph = graph;
    }

    execute() {
        let node = this.get();
        let team = this.graph.getTeamOfNode(node);
        let preprocessing: Command[] = [];
        
        if(team)
            preprocessing = preprocessing.concat(new RemoveMemberFromTeamGroupCommand(team, node));
        
        let links = this.graph.getIngoingLinks(node).concat(this.graph.getOutgoingLinks(node));
        links.forEach((link) => { preprocessing = preprocessing.concat(new RemoveLinkCommand(this.graph, link)) });
        
        this.removeNodeFromEverything = CompositeCommand.of(preprocessing);
        this.removeNodeFromEverything.execute();

        node.remove();
    }

    unexecute() {
        let node = this.get();
        node.addTo(this.graph);
        this.removeNodeFromEverything.unexecute();
    }
}

export class RemoveServiceCommand extends RemoveNodeCommand<joint.shapes.microtosca.Service> {}

export class RemoveDatastoreCommand extends RemoveNodeCommand<joint.shapes.microtosca.Datastore> {}

export class RemoveCommunicationPatternCommand extends RemoveNodeCommand<joint.shapes.microtosca.CommunicationPattern> {}

/*export class RemoveServiceCommand extends ElementCommand<joint.shapes.microtosca.Service> {

    graph: Graph;
    node_name: string;

    team_name: string = null;

    incoming_links = new Map();
    outcoming_links = new Map();

    constructor(graph: Graph, node_name: string) {
        super();
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

export class RemoveDatastoreCommand extends ElementCommand<joint.shapes.microtosca.Datastore> {

    graph: Graph;
    node_name: string;

    team_name: string = null;

    incoming_links = new Map();

    constructor(graph: Graph, node_name: string) {
        super();
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

export class RemoveCommunicationPatternCommand extends ElementCommand<joint.shapes.microtosca.CommunicationPattern> {

    graph: Graph;
    node_name: string;
    type_node: string;
    team_name: string = null;

    incoming_links = new Map();
    outcoming_links = new Map();


    constructor(graph: Graph, node_name: string) {
        super();
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
}*/