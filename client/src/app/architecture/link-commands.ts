import { Command } from '../commands/icommand';
import * as joint from 'jointjs';
import { Graph } from "../graph/model/graph";


export class AddRunTimeLinkCommand implements Command {

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

    constructor(private graph: Graph, private link: joint.dia.Link) {
        this.graph = graph;
        this.link = link;
    }

    execute() {
        this.link.remove();
    }

    unexecute() {
        this.link.addTo(this.graph);
    }
}

export class ChangeLinkSourceCommand implements Command {

    oldSource;

    constructor(private graph: Graph, private link: joint.dia.Link, private newTargetName: string) {}

    execute() {
        this.oldSource = this.link.getTargetElement();
        let newSource = this.graph.getNode(this.newTargetName);
        this.link.source(newSource);
    }

    unexecute() {
        this.link.source(this.oldSource);
    }
}