import { Command } from '../commands/icommand';
import * as joint from 'jointjs';
import { Graph } from "../graph/model/graph";


export class AddLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.RunTimeLink;
    source_name: string;
    target_name: string;

    t: boolean = false; // timeout
    cb: boolean = false; // circuit breaker
    dd: boolean = false;  // dyamic discovery

    constructor(graph: Graph, source_name: string, target_name: string, timeout?, circuit_breaker?, dynamic_discovery?) {
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

export class RemoveLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.RunTimeLink;
    source_name: string;
    target_name: string;
    t: boolean;
    cb:boolean;
    sd:boolean;
    removedLink: joint.shapes.microtosca.RunTimeLink;

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
        this.removedLink = this.link.remove();
    }

    unexecute() {
        this.removedLink.addTo(this.graph);
    }
}