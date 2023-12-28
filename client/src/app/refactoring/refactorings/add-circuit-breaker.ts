import { Graph } from "src/app/graph/model/graph";
import { NodeSmell } from "../smells/smell";
import { Refactoring } from "./refactoring-command";

export class AddCircuitBreakerRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetCircutBeakers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: NodeSmell) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
        this.addedSourceTargetCircutBeakers = [];
    }

    execute() {
        this.links.forEach(link => {
            link.setCircuitBreaker(true);
        })
    }

    unexecute() {
        this.links.forEach(link => {
            link.setCircuitBreaker(false);
        })
    }

    getName() {
        return "Add circuit breaker";
    }

    getDescription() {
        return "Add circuit breaker between two services";
    }

}