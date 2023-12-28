import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { GroupSmell } from "../smells/smell";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand, ElementCommand, Sequentiable } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";


export class AddApiGatewayRefactoring implements Refactoring {

    smell: GroupSmell;
    command: CompositeCommand;

    public static readonly NAME = "Add API Gateway";

    private constructor() {}

    execute(): void {
        this.command.execute();
    }

    unexecute(): void {
        this.command.unexecute();
    }

    getName() {
        return AddApiGatewayRefactoring.NAME;
    }

    getDescription() {
        return `Add an API Gateway between ${this.smell.getNodeBasedCauses().map((n) => n?.getName()).join(", ")} and the external users.`
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {

            constructor() {
                super();
            }

            build(): AddApiGatewayRefactoring {
                let edgeGroup = <joint.shapes.microtosca.EdgeGroup> (<GroupSmell> this.smell).getGroup();
                let commands = [];
                let nodes = this.smell.getNodeBasedCauses();
                if(this.node) {
                    nodes = nodes.filter((n) => n == this.node);
                }
                if(this.team) {
                    nodes = nodes.filter((n) => this.graph.getTeamOfNode(n) == this.team);
                }
                nodes.forEach(node => {
                    let gatewayName = "API Gateway " + node.getName();
                    let addMessageRouterCommandInTeamIfSet: ElementCommand<joint.shapes.microtosca.CommunicationPattern> = new AddMessageRouterCommand(this.graph, gatewayName, this.graph.getPointCloseTo(edgeGroup));
                    if(this.team)
                        addMessageRouterCommandInTeamIfSet = addMessageRouterCommandInTeamIfSet.bind(new AddMemberToTeamGroupCommand(this.team));
                    let addApiGatewayCommand = Sequentiable.of(new RemoveLinkCommand(this.graph, this.graph.getLinkFromSourceToTarget(<joint.shapes.microtosca.Node> (<unknown> edgeGroup), node)))
                                            .then(addMessageRouterCommandInTeamIfSet)
                                            .then(new AddRunTimeLinkCommand(this.graph, edgeGroup.getName(), gatewayName))
                                            .then(new AddRunTimeLinkCommand(this.graph, gatewayName, node.getName()))
                    commands.push(addApiGatewayCommand);
                });
                let refactoring = new AddApiGatewayRefactoring();
                refactoring.command = CompositeCommand.of(commands);
                if(this.team) {
                    refactoring.getDescription = () => `Add an API Gateway between ${nodes.map((n) => n?.getName()).join(", ")} and the external users.`;
                }
                return refactoring;
            }

        }
    }

}