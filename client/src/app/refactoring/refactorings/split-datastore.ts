import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { AddDatastoreCommand, RemoveNodeCommand } from "src/app/architecture/node-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { ChangeLinkTargetCommand } from "src/app/architecture/link-commands";

export class SplitDatastoreRefactoring implements Refactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        smell.getLinkBasedCauses().forEach((link) => {
            let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
            let newDatastoreName = "DB " + sourceNode.getName();
            cmds.push(new AddDatastoreCommand(graph, newDatastoreName, graph.getPointCloseTo(sourceNode)));
            cmds.push(new ChangeLinkTargetCommand(graph, link, newDatastoreName));
        });
        if(graph.getConnectedLinks(smell.getNodeBasedCauses()[0]).length - smell.getLinkBasedCauses().length == 0) {
            cmds.push(new RemoveNodeCommand(graph, smell.getNodeBasedCauses()[0]));
        }
        this.command = CompositeCommand.of(cmds);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Split datastore";
    }

    getDescription() {
        return "Split datastore.";
    }
}