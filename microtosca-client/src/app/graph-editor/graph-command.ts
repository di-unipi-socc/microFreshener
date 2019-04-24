import { Command } from '../invoker/icommand';
import * as joint from 'jointjs';
import { Graph } from "../model/graph";
import { JsonpInterceptor } from '@angular/common/http';


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

export class AddDatabaseCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;

    constructor(graph: Graph, name: string) {
        this.graph = graph;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addDatabase(this.name);
    }

    unexecute() {
        this.node.remove();
    }
}

export class AddCommunicationPatternCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;
    name: string;
    concrete_type: string;

    constructor(graph: Graph, name: string, concretetype: string) {
        this.graph = graph;
        this.concrete_type = concretetype;
        this.name = name;
    }

    execute() {
        this.node = this.graph.addCommunicationPattern(this.name, this.concrete_type);
    }

    unexecute() {
        this.node.remove();
    }
}


export class RemoveServiceCommand implements Command {

    graph: Graph;
    node: joint.shapes.microtosca.Root;


    cloneNode: joint.shapes.microtosca.Root;
    incomingNodes: joint.shapes.microtosca.Root[];
    outcomingNodes: joint.shapes.microtosca.Root[];

    constructor(graph: Graph, node: joint.shapes.microtosca.Root) {
        this.graph = graph;
        this.node = node;
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
        else if (this.node instanceof joint.shapes.microtosca.Database)
            this.node = this.graph.addDatabase(this.cloneNode.getName());
        else if (this.node instanceof joint.shapes.microtosca.CommunicationPattern)
            this.node = this.graph.addCommunicationPattern(this.cloneNode.getName(), (<joint.shapes.microtosca.CommunicationPattern>this.cloneNode).getConcreteType());

        this.incomingNodes.forEach(inNode => {
            this.graph.addRunTimeInteraction(inNode, this.node);
        })
        this.outcomingNodes.forEach(outNode => {
            this.graph.addRunTimeInteraction(this.node, outNode);
        })
    }
}
