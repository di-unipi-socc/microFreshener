import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { CompositeCommand, ElementCommand } from "src/app/commands/icommand";
import { AddMessageRouterCommand } from "src/app/architecture/nodes/node-commands";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/interacts-with-links/interaction-with-commands";


export class AddMessageRouterRefactoring implements Refactoring {

    public static readonly NAME = "Add message router";

    command: CompositeCommand;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add message router";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {
            build(): AddMessageRouterRefactoring {
                let cmds = [];
                let links = this.smell.getLinkBasedCauses();
                if(this.team) {
                    links = links.filter((l) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getSourceElement()) == this.team);
                }
                links.forEach((link) => {
                    cmds.push(new RemoveLinkCommand(this.graph, link));
                    let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
                    let targetNode = <joint.shapes.microtosca.Node> link.getTargetElement();
                    let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
                    let addMessageRouterInTeamIfAny: ElementCommand<joint.shapes.microtosca.Node> = new AddMessageRouterCommand(this.graph, messageRouterName, this.graph.getPointCloseTo(sourceNode));
                    if(this.team)
                        addMessageRouterInTeamIfAny = addMessageRouterInTeamIfAny.bind(new AddMemberToTeamGroupCommand(this.team));
                    cmds.push(addMessageRouterInTeamIfAny);
                    cmds.push(new AddRunTimeLinkCommand(this.graph, sourceNode.getName(), messageRouterName));
                    cmds.push(new AddRunTimeLinkCommand(this.graph, messageRouterName, targetNode.getName()));
                });
                let command = CompositeCommand.of(cmds);
                let refactoring = new AddMessageRouterRefactoring();
                refactoring.getDescription = () => {
                    let msg = "Add a message router between ";
                    msg += links.map((l) => (<joint.shapes.microtosca.Node> l.getSourceElement())?.getName() + " and " + (<joint.shapes.microtosca.Node> l.getTargetElement())?.getName()).join(", ");
                    msg += ".";
                    return msg;
                }
                refactoring.command = command;
                return refactoring;
            }
        }
    }

}