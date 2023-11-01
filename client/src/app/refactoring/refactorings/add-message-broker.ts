import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import * as joint from "jointjs";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";

export class AddMessageBrokerRefactoring implements Refactoring {
    
    cmd: CompositeCommand;
    
    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        // For wobbly service interaction, adding message broker is disable whe the target node is a communication pattern
        let links = smell.getLinkBasedCauses().filter((link) => !(link.getTargetElement() instanceof joint.shapes.microtosca.CommunicationPattern))
        links.forEach((link) => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
            cmds.push(new AddMessageRouterCommand(graph, messageRouterName));
            cmds.push(new RemoveLinkCommand(graph, link));
            cmds.push(new AddLinkCommand(graph, sourceNode.getName(), messageRouterName));
            cmds.push(new AddLinkCommand(graph, messageRouterName, targetNode.getName()));
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
        return "Add message broker";
    }

    getDescription() {
        return "Add message broker between two services";
    }

}