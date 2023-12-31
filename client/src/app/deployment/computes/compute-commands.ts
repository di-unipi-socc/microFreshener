import { g } from "jointjs";
import { Command, CompositeCommand, ElementCommand } from "src/app/commands/icommand";
import { Graph } from "src/app/graph/model/graph";
import { RemoveDeploymentLinkCommand } from "../deployed-on-links/deployed-on-commands";

export class AddComputeCommand extends ElementCommand<joint.shapes.microtosca.Compute> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super();
    }

    execute() {
        let compute = this.graph.addCompute(this.name, this.position);
        this.set(compute);
    }
    unexecute() {
        this.get().remove();
    }
}

export class RemoveComputeCommand extends ElementCommand<joint.shapes.microtosca.Compute> {

    removeNodeFromEverything: Command;

    constructor(private graph: Graph, compute?: joint.shapes.microtosca.Compute) {
        super(compute);
    }

    execute() {
        let compute = this.get();
        
        let links = this.graph.getConnectedLinks(compute);
        let preprocessing = links.map((link) => new RemoveDeploymentLinkCommand(this.graph, link));
        this.removeNodeFromEverything = CompositeCommand.of(preprocessing);
        this.removeNodeFromEverything.execute();

        compute.remove();
    }

    unexecute() {
        let compute = this.get();
        compute.addTo(this.graph);
        this.removeNodeFromEverything.unexecute();
    }
    
}