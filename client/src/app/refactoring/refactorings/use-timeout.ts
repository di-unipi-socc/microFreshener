import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { Command, CompositeCommand } from "src/app/commands/icommand";
import { AddTimeoutCommand } from "src/app/architecture/link-commands";

export class UseTimeoutRefactoring implements Refactoring {

    public static readonly NAME = "Use timeout";

    command: Command;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Use timeout";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {

            build(): UseTimeoutRefactoring {
                let links = this.smell.getLinkBasedCauses();
                if(this.team) {
                    links = links.filter((l) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getSourceElement()) == this.team);
                }
                let command = CompositeCommand.of(links.map((l) => new AddTimeoutCommand(l)));
                let refactoring = new UseTimeoutRefactoring();
                refactoring.command = command;
                refactoring.getDescription = () => {
                    return "Use a timeout with the interactions of " + links.map((l) => (<joint.shapes.microtosca.Node> l.getSourceElement())?.getName() + " towards " + (<joint.shapes.microtosca.Node> l.getTargetElement())?.getName()).join(", ") + ".";
                }
                return refactoring;
            }
        }
    }

}