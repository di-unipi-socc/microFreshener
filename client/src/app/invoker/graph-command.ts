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

export class RemoveLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.RunTimeLink;
    source: joint.shapes.microtosca.Root;
    target: joint.shapes.microtosca.Root;

    constructor(graph: Graph, link: joint.shapes.microtosca.RunTimeLink) {
        this.graph = graph;
        this.link = link;
        this.source = <joint.shapes.microtosca.Root>link.getSourceElement();
        this.target = <joint.shapes.microtosca.Root>link.getTargetElement();
    }

    execute() {
        this.link.remove();
    }

    unexecute() {
        this.graph.addRunTimeInteraction(this.source, this.target, this.link.hasTimeout(), this.link.hasCircuitBreaker(), this.link.hasDynamicDiscovery());
    }
}

export class AddLinkCommand implements Command {

    graph: Graph;
    source: joint.shapes.microtosca.Root;
    target: joint.shapes.microtosca.Root;
    link: joint.shapes.microtosca.RunTimeLink;
    source_name: string;
    target_name: string;

    t: boolean = false; // timeout
    cb: boolean = false; // circuit breaker
    dd: boolean = false;  // dyamic discovery

    constructor(graph: Graph, source: joint.shapes.microtosca.Root, target: joint.shapes.microtosca.Root, timeout, circuit_breaker, dynamic_discovery) {
        this.graph = graph;
        this.source = source;
        this.target = target;
        this.source_name = source.getName();
        this.target_name = source.getName();

        this.t = timeout;
        this.cb = circuit_breaker;
        this.dd = dynamic_discovery;
    }

    execute() {
        var source = this.graph.getNode(this.source_name);
        var target = this.graph.getNode(this.target_name);

        this.link = this.graph.addRunTimeInteraction(this.source, this.target, this.t, this.cb, this.dd);
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
        this.graph.getGroup(this.team_name).remove();
    }

}
