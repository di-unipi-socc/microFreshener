import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import * as joint from "jointjs";
import { CompositeCommand, ElementCommand } from "src/app/commands/icommand";
import { AddMessageBrokerCommand } from "src/app/architecture/nodes/node-commands";
import { AddMemberToTeamGroupCommand } from "src/app/teams/team-commands";
import { AddRunTimeLinkCommand, RemoveLinkCommand } from "src/app/architecture/interacts-with-links/interaction-with-commands";

export class AddMessageBrokerRefactoring implements Refactoring {
    
    public static readonly NAME = "Add message broker";

    command: CompositeCommand;
    
    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add message broker";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {
            build(): AddMessageBrokerRefactoring {
                let cmds = [];
                // For wobbly service interaction, adding message broker is disable whe the target node is a communication pattern
                let links = this.smell.getLinkBasedCauses().filter((link) => !(link.getTargetElement() instanceof joint.shapes.microtosca.CommunicationPattern));
                if(this.team) {
                    links = links.filter((l) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getSourceElement()) == this.team);
                }
                links.forEach((link) => {
                    let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
                    let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
                    let messageRouterName = `${sourceNode.getName()} ${targetNode.getName()}`;
                    let addMessageBrokerInTeamIfAny: ElementCommand<joint.shapes.microtosca.Node> = new AddMessageBrokerCommand(this.graph, messageRouterName, this.graph.getPointCloseTo(sourceNode));
                    if(this.team)
                        addMessageBrokerInTeamIfAny = addMessageBrokerInTeamIfAny.bind(new AddMemberToTeamGroupCommand(this.team));
                    cmds.push(addMessageBrokerInTeamIfAny);
                    cmds.push(new RemoveLinkCommand(this.graph, link));
                    cmds.push(new AddRunTimeLinkCommand(this.graph, sourceNode.getName(), messageRouterName));
                    cmds.push(new AddRunTimeLinkCommand(this.graph, targetNode.getName(), messageRouterName));
                });
                let command = CompositeCommand.of(cmds);
                let refactoring = new AddMessageBrokerRefactoring();
                refactoring.command = command;
                refactoring.getDescription = () => {
                    let msg = "Add a message broker between ";
                    msg += links.map((l) => (<joint.shapes.microtosca.Node> l.getSourceElement())?.getName() + " and " + (<joint.shapes.microtosca.Node> l.getTargetElement())?.getName()).join(", ");
                    msg += ".";
                    return msg;
                }
                return refactoring;
            }
        }
    }

}