import { Graph } from "src/app/graph/model/graph";
import { Refactoring } from "./refactoring-command";
import { SmellObject } from "../smells/smell";
import * as joint from "jointjs";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddMessageBrokerCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";

export class AddMessageBrokerRefactoring implements Refactoring {
    
    command: CompositeCommand;
    
    constructor(graph: Graph, smell: SmellObject) {
        let cmds = [];
        // For wobbly service interaction, adding message broker is disable whe the target node is a communication pattern
        let links = smell.getLinkBasedCauses().filter((link) => !(link.getTargetElement() instanceof joint.shapes.microtosca.CommunicationPattern))
        links.forEach((link) => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
            cmds.push(new AddMessageBrokerCommand(graph, messageRouterName, graph.getPointCloseTo(sourceNode)));
            cmds.push(new RemoveLinkCommand(graph, link));
            cmds.push(new AddRunTimeLinkCommand(graph, sourceNode.getName(), messageRouterName));
            cmds.push(new AddRunTimeLinkCommand(graph, targetNode.getName(), messageRouterName));
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
        return "Add message broker";
    }

    getDescription() {
        return "Add message broker between two services";
    }

}