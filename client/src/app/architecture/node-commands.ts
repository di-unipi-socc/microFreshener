import { Command, CompositeCommand, ElementCommand } from '../commands/icommand';
import * as joint from 'jointjs';
import { g } from 'jointjs';
import { Graph } from "../graph/model/graph";
import { RemoveMemberFromTeamGroupCommand } from '../teams/team-commands';
import { AddRunTimeLinkCommand, ChangeLinkSourceCommand, RemoveLinkCommand } from './link-commands';


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

    graph: Graph;
    removeNodeFromEverything: Command;

    constructor(graph: Graph, node?: T) {
        super(node);
        this.graph = graph;
    }

    execute() {
        let node = this.get();
        let team = this.graph.getTeamOfNode(node);
        let preprocessing: Command[] = [];
        
        if(team)
            preprocessing = preprocessing.concat(new RemoveMemberFromTeamGroupCommand(team, node));
        
        let links = this.graph.getIngoingLinks(node).concat(this.graph.getOutgoingLinks(node));
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

export class MergeServices extends ElementCommand<joint.shapes.microtosca.Service> {

    mergingServices: Set<joint.shapes.microtosca.Service>;
    command: CompositeCommand;

    constructor(
        private graph: Graph,
        private position?: g.Point,
        ...services: joint.shapes.microtosca.Service[]
    ) {
        super();
        this.mergingServices = new Set(services);
    }

    execute() {
        let linksToJustBeDeleted: joint.dia.Link[] = [];
        let linksToBeFromMergedService = new Map<joint.dia.Element, joint.dia.Link>();
        let targetsToBeLinked = new Set<joint.shapes.microtosca.Node>();
        this.mergingServices.forEach((mergingService) => {
            let mergingLinks = this.graph.getConnectedLinks(mergingService);
            mergingLinks.forEach((link) => {
                if(this.mergingServices.has(<joint.shapes.microtosca.Service> link.getTargetElement())) {
                    // If the link targets another merging service, just delete it
                    linksToJustBeDeleted.push(link);
                } else if(linksToBeFromMergedService.has(link.getTargetElement())) {
                    // If the link targets the same target of another merging link, delete both and add a new one to the merged service
                    linksToJustBeDeleted.push(link);
                    linksToJustBeDeleted.push(linksToBeFromMergedService.get(link.getTargetElement()));
                    targetsToBeLinked.add(<joint.shapes.microtosca.Node>  link.getTargetElement());
                } else {
                    // If the link targets a new non-merging service, change the source to the newly creating merging service
                    linksToBeFromMergedService.set(link.getTargetElement(), link);
                }});
        })

        let cmds = [];
        // Add merged service
        let mergedServiceName = Array.from(this.mergingServices).map((service) => service.getName()).join(" + ")
        let addMergedServiceCommand = new AddServiceCommand(this.graph, mergedServiceName, this.position);
        cmds.push(addMergedServiceCommand);
        // Create link manipulation commands
        cmds = cmds.concat(linksToJustBeDeleted.map((link) => new RemoveLinkCommand(this.graph, link)));
        cmds = cmds.concat(Array.from(linksToBeFromMergedService.values()).map((link) => new ChangeLinkSourceCommand(this.graph, link, mergedServiceName)));
        cmds = cmds.concat(Array.from(targetsToBeLinked).map((target) => new AddRunTimeLinkCommand(this.graph, mergedServiceName, target.getName())));
        this.command = CompositeCommand.of(cmds);
        // Execute the composed command and set the newly created service
        this.command.execute();
        this.set(addMergedServiceCommand.get());
    }

    unexecute() {
        this.command.unexecute();
    }
    
}