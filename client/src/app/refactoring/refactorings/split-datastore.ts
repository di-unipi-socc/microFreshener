import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { AddDatastoreCommand, RemoveNodeCommand } from "src/app/architecture/node-commands";
import { CompositeCommand } from "src/app/commands/icommand";
import { ChangeLinkTargetCommand } from "src/app/architecture/link-commands";

export class SplitDatastoreRefactoring implements Refactoring {

    public static readonly NAME = "Split datastore";

    command: CompositeCommand;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Split datastore";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {
            build(): SplitDatastoreRefactoring {
                let cmds = [];
                let links = this.smell.getLinkBasedCauses();
                if(this.team) {
                    links = links.filter((link) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()) == this.team && this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getTargetElement()) == this.team);
                }
                links.forEach((link) => {
                    let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
                    let newDatastoreName = "DB " + sourceNode.getName();
                    cmds.push(new AddDatastoreCommand(this.graph, newDatastoreName, this.graph.getPointCloseTo(sourceNode)));
                    cmds.push(new ChangeLinkTargetCommand(this.graph, link, newDatastoreName));
                });
                if(this.graph.getConnectedLinks(this.smell.getNodeBasedCauses()[0]).length) {
                    cmds.push(new RemoveNodeCommand(this.graph, this.smell.getNodeBasedCauses()[0]));
                }
                let command = CompositeCommand.of(cmds);
                let refactoring = new SplitDatastoreRefactoring();
                refactoring.command = command;
                let sharedDatastores = new Set(links.map((link) => <joint.shapes.microtosca.Node>link.getTargetElement()));
                refactoring.getDescription = () => {
                    return "Split " + Array.from(sharedDatastores).map((d) => d?.getName()).join(", ") + " among their users.";
                }
                return refactoring;
            }

        }
    }
}