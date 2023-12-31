import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { GroupSmell, Smell } from "../smells/smell";
import { AddMessageRouterCommand } from "src/app/architecture/node-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/link-commands";
import { CompositeCommand, ElementCommand, Sequentiable } from "src/app/commands/icommand";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";


export class AddApiGatewayRefactoring implements Refactoring {

    command: CompositeCommand;

    public static readonly NAME = "Add API Gateway";

    private constructor(private smell: Smell) {}

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
                let edgeGroup = (<GroupSmell> this.smell).getGroup();
                console.debug("Edge group: ", edgeGroup)
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
                    let addMessageRouterCommandInTeamIfSet: ElementCommand<joint.shapes.microtosca.CommunicationPattern> = new AddMessageRouterCommand(this.graph, gatewayName, this.graph.getPointCloseTo(node));
                    if(this.team)
                        addMessageRouterCommandInTeamIfSet = addMessageRouterCommandInTeamIfSet.bind(new AddMemberToTeamGroupCommand(this.team));
                    let addApiGatewayCommand = Sequentiable.of(new RemoveLinkCommand(this.graph, this.graph.getLinkFromSourceToTarget(<joint.shapes.microtosca.Node> (<unknown> edgeGroup), node)))
                                            .then(addMessageRouterCommandInTeamIfSet)
                                            .then(new AddRunTimeLinkCommand(this.graph, edgeGroup.getName(), gatewayName))
                                            .then(new AddRunTimeLinkCommand(this.graph, gatewayName, node.getName()))
                    commands.push(addApiGatewayCommand);
                });
                let refactoring = new AddApiGatewayRefactoring(this.smell);
                refactoring.command = CompositeCommand.of(commands);
                if(this.team) {
                    refactoring.getDescription = () => `Add an API Gateway between ${nodes.map((n) => n?.getName()).join(", ")} and the external users.`;
                }
                return refactoring;
            }

        }
    }

}