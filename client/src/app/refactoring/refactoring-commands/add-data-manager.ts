import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smell";

export class AddDataManagerRefactoring implements Refactoring {

    graph: Graph;
    smell: SmellObject;

    sharedDB: joint.shapes.microtosca.Datastore;
    databaseManager: joint.shapes.microtosca.Service;

    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDB = <joint.shapes.microtosca.Datastore>this.smell.getNodeBasedCauses()[0];
    }

    execute() {
        this.databaseManager = this.graph.addService("DB manager");

        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.databaseManager);
        });

        this.graph.addRunTimeInteraction(this.databaseManager, this.sharedDB);
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.sharedDB);
        });
        this.databaseManager.remove();
    }

    getName() {
        return "Add data manager";
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}