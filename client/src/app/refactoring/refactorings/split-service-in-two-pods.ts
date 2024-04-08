import { Refactoring, RefactoringBuilder } from "./refactoring-command";
import { CompositeCommand } from "src/app/commands/icommand";
import { AddComputeCommand, RemoveComputeCommand } from "src/app/deployment/computes/compute-commands";
import { ChangeDeploymentLinkTargetCommand } from "src/app/deployment/deployed-on-links/deployed-on-commands";

export class SplitServiceInTwoPods implements Refactoring {

    public static readonly NAME = "Split service in two pods";

    command: CompositeCommand;

    private constructor() {}

    execute() {
        this.command.execute();
    }

    unexecute() {
        this.command.unexecute();
    }

    getName() {
        return "Split service in two pods";
    }

    getDescription(): string {
        throw Error("This should be implemented in the builder.");
    }

    static builder() {
        return new class Builder extends RefactoringBuilder {
            build(): SplitServiceInTwoPods {
                let cmds = [];
                let links = <joint.shapes.microtosca.DeploymentTimeLink[]> this.smell.getLinkBasedCauses();
                if(this.team) {
                    links = links.filter((link) => this.graph.getTeamOfNode(<joint.shapes.microtosca.Node> link.getSourceElement()) == this.team);
                }
                console.debug("Split service in two pods", "LinkBasedCauses", this.smell.getLinkBasedCauses(), "NodeBasedCauses", this.smell.getNodeBasedCauses());
                links.forEach((link) => {
                    let sourceNode = <joint.shapes.microtosca.Node> link.getSourceElement();
                    let newComputeName = sourceNode.getName() + " container";
                    cmds.push(new AddComputeCommand(this.graph, newComputeName, this.graph.getPointCloseTo(sourceNode)));
                    cmds.push(new ChangeDeploymentLinkTargetCommand(this.graph, link, newComputeName));
                });
                // If the datastore won't be used after the application of the refactoring, remove it
                let compute = this.smell.getNodeBasedCauses()[0];
                if(this.graph.getConnectedLinks(compute).length - links.length == 0) {
                    cmds.push(new RemoveComputeCommand(this.graph, compute));
                }
                let command = CompositeCommand.of(cmds);
                let refactoring = new SplitServiceInTwoPods();
                refactoring.command = command;
                let multipleNodesInContainer = new Set(links.map((l) => <joint.shapes.microtosca.Node> l.getSourceElement()));
                refactoring.getDescription = () => {
                    return "Deploy " + Array.from(multipleNodesInContainer).join(", ") + " in single containers.";
                }
                return refactoring;
            }

        }
    }
}