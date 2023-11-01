import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddServiceCommand, RemoveNodeCommand } from "src/app/architecture/node-commands";
import { AddLinkCommand } from "src/app/architecture/link-commands";

export class MergeServicesRefactoring implements Refactoring {

    cmd: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        let sharedDatastore = <joint.shapes.microtosca.Datastore> smell.getNodeBasedCauses()[0];
        smell.getLinkBasedCauses()
                .map((link) => <joint.shapes.microtosca.Node> link.getSourceElement())
                .map((node) => new RemoveNodeCommand(graph, node))
                .forEach((cmd) => cmds.push(cmd));
        let mergedServiceName = "Merged Service";
        cmds.push(new AddServiceCommand(graph, mergedServiceName));
        cmds.push(new AddLinkCommand(graph, mergedServiceName, sharedDatastore.getName()));
        this.cmd = CompositeCommand.of(cmds);
    }

    execute() {
        this.cmd.execute();
    }

    unexecute() {
        this.cmd.unexecute();
    }

    getName() {
        return "Merge services";
    }

    getDescription() {
        return "Merge the services accessing the same database";
    }

}