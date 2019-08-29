import { Command } from './icommand';
import * as joint from 'jointjs';
import { Graph } from "../model/graph";


export class AddServiceCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;

    constructor(graph: Graph, name: string) {
        this.graph = graph;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addService(this.name);
    }

    unexecute() {
        this.node.remove();
    }
}

export class AddDatastoreCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;

    constructor(graph: Graph, name: string) {
        this.graph = graph;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addDatastore(this.name);
    }

    unexecute() {
        this.node.remove();
    }
}

export class AddMessageBrokerCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;

    constructor(graph: Graph, name: string) {
        this.graph = graph;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addMessageBroker(this.name);
    }

    unexecute() {
        this.node.remove();
    }
}

export class AddMessageRouterCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;

    constructor(graph: Graph, name: string) {
        this.graph = graph;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addMessageRouter(this.name);
    }

    unexecute() {

        this.node.remove();
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

export class RemoveLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.RunTimeLink;
    source_name: string;
    target_name: string;
    t: boolean;
    cb:boolean;
    sd:boolean;

    constructor(graph: Graph, link: joint.shapes.microtosca.RunTimeLink) {
        this.graph = graph;
        this.link = link;
        var source = <joint.shapes.microtosca.Root>link.getSourceElement();
        var target = <joint.shapes.microtosca.Root>link.getTargetElement();
        this.source_name = source.getName();
        this.target_name = target.getName();
        this.t = this.link.hasTimeout();
        this.cb = this.link.hasCircuitBreaker();
        this.sd =  this.link.hasDynamicDiscovery();
    }

    execute() {
        this.link.remove();
    }

    unexecute() {
        var source = this.graph.getNode(this.source_name);
        var target = this.graph.getNode(this.target_name);
        this.graph.addRunTimeInteraction(source, target, this.t, this.cb, this.sd);
    }
}

export class AddLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.RunTimeLink;
    source_name: string;
    target_name: string;

    t: boolean = false; // timeout
    cb: boolean = false; // circuit breaker
    dd: boolean = false;  // dyamic discovery

    constructor(graph: Graph, source_name: string, target_name: string, timeout, circuit_breaker, dynamic_discovery) {
        this.graph = graph;
        this.source_name = source_name;
        this.target_name = target_name;

        this.t = timeout;
        this.cb = circuit_breaker;
        this.dd = dynamic_discovery;
    }

    execute() {
        var source = this.graph.getNode(this.source_name);
        var target = this.graph.getNode(this.target_name);
        this.link = this.graph.addRunTimeInteraction(source, target, this.t, this.cb, this.dd);
    }

    unexecute() {
        this.link.remove();
    }

}


export class AddTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;

    constructor(graph: Graph, team_name: string) {
        this.graph = graph;
        this.team_name = team_name;
    }

    execute() {
        this.graph.addTeamGroup(this.team_name);
    }

    unexecute() {
        var team = this.graph.getGroup(this.team_name);
        team.remove();
    }

}


export class AddMemberToTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;
    member_name: string;

    constructor(graph: Graph, team_name: string, member_name:string) {
        this.graph = graph;
        this.team_name = team_name;
        this.member_name = member_name;
    }

    execute() {
        var team = this.graph.getGroup(this.team_name)
        var node = this.graph.getNode(this.member_name);
        team.addMember(node);
    }

    unexecute() {
        var team = this.graph.getGroup(this.team_name);
        var node = this.graph.getNode(this.member_name);
        team.removeMember(node);
    }
}


export class RemoveMemberFromTeamGroupCommand implements Command {

    graph: Graph;
    team_name: string;
    member_name: string;

    constructor(graph: Graph, team_name: string, member_name:string) {
        this.graph = graph;
        this.team_name = team_name;
        this.member_name = member_name;
    }

    execute() {
        var team = this.graph.getGroup(this.team_name)
        var node = this.graph.getNode(this.member_name);
        team.removeMember(node);
    }

    unexecute() {
        var team = this.graph.getGroup(this.team_name);
        var node = this.graph.getNode(this.member_name);
        team.addMember(node);
    }
}