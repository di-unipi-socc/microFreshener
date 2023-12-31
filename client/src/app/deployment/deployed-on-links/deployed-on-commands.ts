import { Command } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";

export class AddDeploymentLinkCommand implements Command {

    graph: Graph;
    link: joint.shapes.microtosca.DeploymentTimeLink;
    source_name: string;
    target_name: string;

    constructor(graph: Graph, source_name: string, target_name: string) {
        this.graph = graph;
        this.source_name = source_name;
        this.target_name = target_name;
    }

    execute() {
        var source = this.graph.getNode(this.source_name);
        var target = this.graph.getNode(this.target_name);
        this.link = this.graph.addDeploymentTimeInteraction(source, target);
    }

    unexecute() {
        this.link.remove();
    }

}

export class RemoveDeploymentLinkCommand implements Command {

    constructor(private graph: Graph, private link: joint.shapes.microtosca.DeploymentTimeLink) {
        this.graph = graph;
        this.link = link;
    }

    execute() {
        this.link.remove();
    }

    unexecute() {
        this.link.addTo(this.graph);
    }
}

export class ChangeDeploymentLinkTargetCommand implements Command {

    oldTarget;

    constructor(private graph: Graph, private link: joint.shapes.microtosca.DeploymentTimeLink, private newTargetName: string) {}

    execute() {
        this.oldTarget = this.link.getTargetElement();
        let newTarget = this.graph.getNode(this.newTargetName);
        this.link.target(newTarget);
    }

    unexecute() {
        this.link.target(this.oldTarget);
    }
}