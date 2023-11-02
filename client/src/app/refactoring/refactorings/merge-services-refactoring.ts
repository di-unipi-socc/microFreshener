import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddServiceCommand, RemoveNodeCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, ChangeLinkSourceCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";

export class MergeServicesRefactoring implements Refactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        // Add the new merged service and link it to the datastore
        let databaseUsers = smell.getLinkBasedCauses().map((link) => (<joint.shapes.microtosca.Node> link.getSourceElement()));
        let mergedServiceName = `Merged Service (${databaseUsers.map((node) => node.getName()).join(" + ")})`;
        cmds.push(new AddServiceCommand(graph, mergedServiceName));
        let sharedDatastore = <joint.shapes.microtosca.Datastore> smell.getNodeBasedCauses()[0];
        cmds.push(new AddRunTimeLinkCommand(graph, mergedServiceName, sharedDatastore.getName()));
        // Change the sources of the merging services from the current service to the merged one, then remove the mergin service
        databaseUsers.forEach((node) => {
                    graph.getConnectedLinks(node).forEach((link) => {
                        if(link.getTargetElement() == sharedDatastore)
                            cmds.push(new RemoveLinkCommand(graph, <joint.shapes.microtosca.RunTimeLink> link));
                        else
                            cmds.push(new ChangeLinkSourceCommand(graph, link, mergedServiceName));
                    });
                    cmds.push(new RemoveNodeCommand(graph,));
                })
        this.command = CompositeCommand.of(cmds);
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
        return "Merge the services accessing the same database";
    }

}