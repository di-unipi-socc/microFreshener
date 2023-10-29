import { Graph } from "src/app/graph/model/graph";
import { GroupRefactoring, Refactoring, RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smells/smell";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";

export class AddApiGatewayRefactoring extends GroupRefactoring {

    smell: GroupSmellObject;

    constructor(graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
        this.smell = smell;
    }

    getGroupRefactoringImplementation(graph, smell) {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup> smell.getGroup();
        let commands = [];
        smell.getNodeBasedCauses().forEach(node => {
            let gatewayName = "API Gateway " + node.getName();
            let addApiGatewayCommand = new AddMessageRouterCommand(graph, gatewayName)
                                    .then(new AddMessageRouterCommand(graph, gatewayName))
                                    .then(new AddLinkCommand(graph, edgeGroup.getName(), gatewayName))
                                    .then(new AddLinkCommand(graph, gatewayName, node.getName()))
                                    .then(new RemoveLinkCommand(graph, graph.getLinkFromSourceToTarget(edgeGroup, node)));
            commands.push(addApiGatewayCommand);
            this.addMemberRefactoring(node, addApiGatewayCommand);
        });
        return commands;
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