import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smell";

export class SplitDatastoreRefactoring implements Refactoring {

    graph: Graph;
    smell: SmellObject;

    sharedDatastore: joint.shapes.microtosca.Datastore;
    splittedDatastore: joint.shapes.microtosca.Datastore[];


    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatastore = <joint.shapes.microtosca.Datastore>smell.getNodeBasedCauses()[0];
        this.splittedDatastore = [];
    }


    execute() {

        this.smell.getLinkBasedCauses().forEach(link => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let newDB = this.graph.addDatastore("DB " + sourceNode.getName());
            this.splittedDatastore.push(newDB);
            link.target(newDB);
        })
        this.sharedDatastore.remove();
    }

    unexecute() {
        this.sharedDatastore = <joint.shapes.microtosca.Datastore>this.smell.getNodeBasedCauses()[0];
        this.graph.addCell(this.sharedDatastore);
        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.sharedDatastore);
        })
        this.splittedDatastore.forEach(db => db.remove())
    }

    getName() {
        return "Split datastore";
    }

    getDescription() {
        return "Split database";
    }
}