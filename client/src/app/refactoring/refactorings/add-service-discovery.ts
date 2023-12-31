import { AddDynamicDiscoveryCommand } from "src/app/architecture/interacts-with-links/interaction-with-commands";
import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { Command, CompositeCommand } from "src/app/commands/icommand";

export class AddServiceDiscoveryRefactoring implements Refactoring {

    public static readonly NAME = "Add service discovery";

    command: Command;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Add service discovery";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {

            build(): AddServiceDiscoveryRefactoring {
                let links = this.smell.getLinkBasedCauses();
                if(this.team) {
                    links = links.filter((l) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> l.getSourceElement()) == this.team);
                }
                let command = CompositeCommand.of(links.map((l) => new AddDynamicDiscoveryCommand(l)));
                let refactoring = new AddServiceDiscoveryRefactoring();
                refactoring.command = command;
                refactoring.getDescription = () => {
                    return "Add service discovery to the interactions of " + links.map((l) => (<joint.shapes.microtosca.Node> l.getSourceElement())?.getName() + " towards " + (<joint.shapes.microtosca.Node> l.getTargetElement())?.getName()).join(", ") + ".";
                }
                return refactoring;
            }
        }
    }

}