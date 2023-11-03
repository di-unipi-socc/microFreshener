import { Graph } from "src/app/graph/model/graph";
import { SmellObject } from "../smells/smell";
import { Refactoring } from "./refactoring-command";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";

export class AddMessageRouterRefactoring implements Refactoring {

    command: CompositeCommand;

    constructor(graph: Graph, smell: SmellObject) {
        let links = smell.getLinkBasedCauses();
        let cmds = [];
        links.forEach((link) => {
            cmds.push(new RemoveLinkCommand(graph, link));
            let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node> link.getTargetElement();
            let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
            cmds.push(new AddMessageRouterCommand(graph, messageRouterName, graph.getPointCloseTo(sourceNode)));
            cmds.push(new AddRunTimeLinkCommand(graph, sourceNode.getName(), messageRouterName));
            cmds.push(new AddRunTimeLinkCommand(graph, messageRouterName, targetNode.getName()));
        });
        this.command = CompositeCommand.of(cmds);
    }

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add message router";
    }

    getDescription() {
        return "Add message router between two services";
    }

}