import { Graph } from "src/app/graph/model/graph";
import { RefactoringCommand } from "./refactoring-command";
import { GroupSmellObject } from "../smell";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";

export class AddApiGatewayRefactoring extends RefactoringCommand {

    smell: GroupSmellObject;

    constructor(private graph: Graph, smell: GroupSmellObject) {
        super(graph, smell);
        this.smell = smell;
    }

    getRefactoringImplementation(graph, smell) {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup> smell.getGroup();
        let commands = [];
        smell.getNodeBasedCauses().forEach(node => {
            let gatewayName = "API Gateway " + node.getName();
            let addGatewayCommand = new AddMessageRouterCommand(graph, gatewayName);
            commands.push(addGatewayCommand);
            let addEdgeGatewayLinkCommand = new AddLinkCommand(graph, edgeGroup.getName(), gatewayName);
            commands.push(addEdgeGatewayLinkCommand);
            let addGatewayNodeLink = new AddLinkCommand(graph, gatewayName, node.getName());
            commands.push(addGatewayNodeLink);
            let linkToRemove = graph.getLinkFromSourceToTarget(edgeGroup, node);
            commands.push(new RemoveLinkCommand(graph, linkToRemove));
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