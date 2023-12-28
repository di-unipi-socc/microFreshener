import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { NodeSmell } from "../smells/smell";

export class AddServiceDiscoveryRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];

    constructor(graph: Graph, smell: NodeSmell) {
        this.links = smell.getLinkBasedCauses();
    }

    execute() {
        this.links.forEach(link => {
            link.setDynamicDiscovery(true);
        })
    }

    unexecute() {
        this.links.forEach(link => {
            link.setDynamicDiscovery(false);
        })
    }

    getName() {
        return "Add service discovery";
    }

    getDescription() {
        return "Add service discovery";
    }

}