import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { RemoveNodeCommand } from "src/app/architecture/node-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddLinkCommand } from "src/app/architecture/link-commands";

export class SplitDatastoreRefactoring implements Refactoring {

    cmd: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        cmds.push(new RemoveNodeCommand(graph, smell.getNodeBasedCauses()[0]));
        smell.getLinkBasedCauses().forEach((link) => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let newDatastoreName = "DB " + sourceNode.getName();
            cmds.push(new AddLinkCommand(graph, sourceNode.getName(), newDatastoreName));
        });
        this.cmd = CompositeCommand.of(cmds);
    }

    execute() {
        this.cmd.execute();
    }

    unexecute() {
        this.cmd.unexecute();
    }

    getName() {
        return "Split datastore";
    }

    getDescription() {
        return "Split database";
    }
}