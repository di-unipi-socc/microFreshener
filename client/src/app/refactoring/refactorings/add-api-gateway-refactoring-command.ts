import { Graph } from "src/app/graph/model/graph";
import { GroupRefactoring } from "./refactoring-command";
import { GroupSmellObject } from "../smells/smell";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand, Sequentiable } from "src/app/commands/icommand";

export class AddApiGatewayRefactoring extends GroupRefactoring {

    smell: GroupSmellObject;
    command: CompositeCommand;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super();
        this.smell = smell;
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup> smell.getGroup();
        let commands = [];
        smell.getNodeBasedCauses().forEach(node => {
            let gatewayName = "API Gateway " + node.getName();
            let addApiGatewayCommand = Sequentiable.of(new RemoveLinkCommand(graph, graph.getLinkFromSourceToTarget(edgeGroup, node)))
                                    .then(new AddMessageRouterCommand(graph, gatewayName, graph.getPointCloseTo(edgeGroup)))
                                    .then(new AddRunTimeLinkCommand(graph, edgeGroup.getName(), gatewayName))
                                    .then(new AddRunTimeLinkCommand(graph, gatewayName, node.getName()))
            commands.push(addApiGatewayCommand);
            let name = this.getName();
            let description = `Add an API Gateway before ${node.getName()}`
            this.addMemberRefactoring(node, addApiGatewayCommand, name, description);
        });
        this.command = CompositeCommand.of(commands);
    }

    execute(): void {
        this.execute();
    }

    unexecute(): void {
        this.unexecute();
    }

    getName() {
        return "Add Api Gateway";
    }

    getDescription() {
        let msg = "Add an Api Gateway from the external user to "
        this.smell.getNodeBasedCauses().forEach(node =>
            msg += ` ${node.getName()}`
        );
        return msg;
    }

}