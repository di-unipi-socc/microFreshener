import { Graph } from "src/app/graph/model/graph";
import { SmellObject } from "../smells/smell";
import { Refactoring } from "./refactoring-command";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";

export class AddMessageRouterRefactoring implements Refactoring {

    cmd: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let links = smell.getLinkBasedCauses();
        let cmds = [];
        links.forEach((link) => {
            cmds.push(new RemoveLinkCommand(graph, link));
            let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node> link.getTargetElement();
            let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
            cmds.push(new AddMessageRouterCommand(graph, messageRouterName));
            cmds.push(new AddLinkCommand(graph, sourceNode.getName(), messageRouterName));
            cmds.push(new AddLinkCommand(graph, messageRouterName, targetNode.getName()));
        });
        this.cmd = CompositeCommand.of(cmds);
        console.debug("Commands are", cmds, this.cmd);
    }

    execute() {
        this.cmd.execute();
    }

    unexecute() {
        this.cmd.unexecute();
    }

    getName() {
        return "Add message router";
    }

    getDescription() {
        return "Add message router between two services";
    }

}