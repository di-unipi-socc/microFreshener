import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { MergeServicesCommand } from "src/app/architecture/node-commands";

export class MergeServicesRefactoring implements Refactoring {

    command: MergeServicesCommand;

    constructor(graph: Graph, smell: SmellObject) {
        // Add the new merged service and link it to the datastore
        let databaseUsers = smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        this.command = new MergeServicesCommand(graph, undefined, ...databaseUsers);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Merge services";
    }

    getDescription() {
        return "Merge the services accessing the same datastore.";
    }

}