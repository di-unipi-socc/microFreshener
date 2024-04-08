import { Command, CompositeCommand, ElementCommand } from '../../commands/icommand';
import * as joint from 'jointjs';
import { g } from 'jointjs';
import { Graph } from "../../graph/model/graph";
import { RemoveMemberFromTeamGroupCommand } from '../../teams/team-commands';
import { AddRunTimeLinkCommand, ChangeLinkTargetCommand, RemoveLinkCommand } from '../interacts-with-links/interaction-with-commands';


export abstract class AddNodeCommand<T extends joint.shapes.microtosca.Node> extends ElementCommand<T> {

    name: string;
    position?: g.Point;

    constructor(name: string, position?: g.Point) {
        super();
        this.name = name;
        this.position = position;
    }

    protected abstract generateNode(): T;

    execute() {
        this.set(this.generateNode());
    }

    unexecute() {
        this.get().remove();
    }
}

export class AddServiceCommand extends AddNodeCommand<joint.shapes.microtosca.Service> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addService(this.name, this.position);
    }
}

export class AddDatastoreCommand extends AddNodeCommand<joint.shapes.microtosca.Datastore> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addDatastore(this.name, this.position);
    }
}

export class AddMessageBrokerCommand extends AddNodeCommand<joint.shapes.microtosca.CommunicationPattern> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addMessageBroker(this.name, this.position);
    }
}

export class AddMessageRouterCommand extends AddNodeCommand<joint.shapes.microtosca.CommunicationPattern> {

    constructor(
        private graph: Graph,
        public name: string,
        public position?: g.Point,
    ) {
        super(name, position);
    }

    generateNode() {
        return this.graph.addMessageRouter(this.name, this.position);
    }
}

export class RemoveNodeCommand<T extends joint.shapes.microtosca.Node> extends ElementCommand<T> {

    removeNodeFromEverything: Command;

    constructor(private graph: Graph, node?: T) {
        super(node);
    }

    execute() {
        let node = this.get();
        let team = this.graph.getTeamOfNode(node);
        let preprocessing: Command[] = [];
        
        if(team)
            preprocessing = preprocessing.concat(new RemoveMemberFromTeamGroupCommand(team, node));
        
        let links = this.graph.getConnectedLinks(node);
        links.forEach((link) => { preprocessing = preprocessing.concat(new RemoveLinkCommand(this.graph, link)) });
        
        this.removeNodeFromEverything = CompositeCommand.of(preprocessing);
        this.removeNodeFromEverything.execute();

        node.remove();
    }

    unexecute() {
        let node = this.get();
        node.addTo(this.graph);
        this.removeNodeFromEverything.unexecute();
    }
}

export class RemoveServiceCommand extends RemoveNodeCommand<joint.shapes.microtosca.Service> {}

export class RemoveDatastoreCommand extends RemoveNodeCommand<joint.shapes.microtosca.Datastore> {}

export class RemoveCommunicationPatternCommand extends RemoveNodeCommand<joint.shapes.microtosca.CommunicationPattern> {}

export class MergeServicesCommand extends ElementCommand<joint.shapes.microtosca.Service> {

    addMergedServiceCommand: AddServiceCommand;
    command: CompositeCommand;

    constructor(
        graph: Graph,
        position?: g.Point,
        ...services: joint.shapes.microtosca.Service[]
    ) {
        super();
        let mergingServices = new Set(services);
        let linksToBeDeleted: joint.dia.Link[] = [];
        let linksToBeMoved: joint.dia.Link[] = [];
        let targets = new Set<joint.dia.Element>();
        mergingServices.forEach((mergingService) => {
            let merginServiceLinks = graph.getConnectedLinks(mergingService);
            merginServiceLinks.forEach((link) => {
                if(link.getSourceElement() == mergingService) {
                    // Delete the outgoing links
                    linksToBeDeleted.push(link);
                    // If the link goes to a non-merging service, add a new link towards that target
                    if(!graph.isService(link.getTargetElement()) || !mergingServices.has(<joint.shapes.microtosca.Service> link.getTargetElement())) {
                        targets.add(link.getTargetElement());
                    }
                } else {
                    // Delete the ingoing links that come from a merging services
                    if(mergingServices.has(<joint.shapes.microtosca.Node> link.getSourceElement())) {
                        linksToBeDeleted.push(link);
                    } else {
                        // If the link comes from a non-merging service, just change its target to the new merged service
                        linksToBeMoved.push(link);
                    }
                }
            });
        });
        let cmds = [];
        // Add merged service
        let mergedServiceName = `Merged service (${Array.from(mergingServices).map((service) => service.getName()).join(" + ")})`
        this.addMergedServiceCommand = new AddServiceCommand(graph, mergedServiceName, position);
        cmds.push(this.addMergedServiceCommand);
        // Create link manipulation commands
        cmds = cmds.concat(linksToBeDeleted.map((link) => new RemoveLinkCommand(graph, link)));
        cmds = cmds.concat(Array.from(linksToBeMoved.values()).map((link) => new ChangeLinkTargetCommand(graph, link, mergedServiceName)));
        cmds = cmds.concat(Array.from(targets.values()).map((target) => new AddRunTimeLinkCommand(graph, mergedServiceName, (<joint.shapes.microtosca.Node> target).getName())));
        // Remove all the merged services
        cmds = cmds.concat(Array.from(mergingServices).map((service: joint.shapes.microtosca.Service) => {console.debug("Remove command for node", service); return new RemoveServiceCommand(graph, service)}));
        this.command = CompositeCommand.of(cmds);
    }

    execute() {
        // Execute the composed command and set the newly created service
        this.command.execute();
        this.set(this.addMergedServiceCommand.get());
    }

    unexecute() {
        this.command.unexecute();
    }

}
