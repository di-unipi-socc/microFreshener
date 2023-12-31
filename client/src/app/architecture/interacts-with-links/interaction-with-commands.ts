import { Command } from '../../commands/icommand';
import * as joint from 'jointjs';
import { Graph } from "../../graph/model/graph";


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

export class ChangeLinkTargetCommand implements Command {

    oldTarget;

    constructor(private graph: Graph, private link: joint.dia.Link, private newTargetName: string) {}

    execute() {
        this.oldTarget = this.link.getTargetElement();
        let newTarget = this.graph.getNode(this.newTargetName);
        this.link.target(newTarget);
    }

    unexecute() {
        console.debug("Undoing ChangeLinkTargetCommand. Old target is", this.oldTarget);
        this.link.target(this.oldTarget);
    }
}

export class AddDynamicDiscoveryCommand implements Command {
    
    previousStatus;

    constructor(private link: joint.shapes.microtosca.RunTimeLink) {}

    execute() {
        this.previousStatus = this.link.hasDynamicDiscovery();
        if(!this.previousStatus)
            this.link.setDynamicDiscovery(true);
    }

    unexecute() {
        if(!this.previousStatus)
            this.link.setDynamicDiscovery(this.previousStatus);
    }
}

export class AddCircuitBreakerCommand implements Command {
    
    previousStatus;

    constructor(private link: joint.shapes.microtosca.RunTimeLink) {}

    execute() {
        this.previousStatus = this.link.hasCircuitBreaker();
        if(!this.previousStatus)
            this.link.setCircuitBreaker(true);
    }

    unexecute() {
        if(!this.previousStatus)
            this.link.setCircuitBreaker(this.previousStatus);
    }
}

export class AddTimeoutCommand implements Command {
    
    previousStatus;

    constructor(private link: joint.shapes.microtosca.RunTimeLink) {}

    execute() {
        this.previousStatus = this.link.hasTimeout();
        if(!this.previousStatus)
            this.link.setTimedout(true);
    }

    unexecute() {
        if(!this.previousStatus)
            this.link.setTimedout(this.previousStatus);
    }
}