import { Graph } from "../graph/model/graph";
import { SmellObject, GroupSmellObject, NoApiGatewaySmellObject, SingleLayerTeamsSmellObject } from './smell';
import { Command } from "../commands/icommand";
import * as joint from 'jointjs';
import { AddMessageRouterCommand } from "src/app/commands/node-commands";
import { AddLinkCommand, RemoveLinkCommand } from "src/app/commands/link-commands";

export interface Refactoring extends Command {
    getName(): string;
    getDescription(): string;
}

abstract class RefactoringCommand implements Refactoring {
    
    refactoring: Command[];

    abstract refactor(): Command[];

    execute() {
        this.refactoring = this.refactor();
        this.refactoring.forEach(command => command.execute());
    }

    unexecute() {
        this.refactoring.forEach(command => command.unexecute());
    }

    abstract getName(): string;
    abstract getDescription(): string;
}

export class IgnoreOnceRefactoring implements Refactoring, Command {

    smell: SmellObject;
    element: joint.shapes.microtosca.Root;

    constructor(element: joint.shapes.microtosca.Root, smell: SmellObject) {
        this.smell = smell;
        this.element = element;
    }

    execute() {
        this.element.removeSmell(this.smell);
    }

    unexecute() {
        this.element.addSmell(this.smell);
    }

    getName() {
        return "Ignore once";
    }

    getDescription() {
        return "Ignore the smell";
    }

}

export class IgnoreAlwaysRefactoring implements Refactoring {

    smell: SmellObject;
    element: joint.shapes.microtosca.Root;

    constructor(element: joint.shapes.microtosca.Root, smell: SmellObject) {
        this.smell = smell;
        this.element = element;
    }

    execute() {
        this.element.ignoreAlways(this.smell);
    }

    unexecute() {
        this.element.undoIgnoreAlways(this.smell);
    }

    getName() {
        return "Ignore always";
    }

    getCommand() {
        return this;
    }

    getDescription() {
        return "Ignore the smell forever.";
    }

}

export class AddApiGatewayRefactoring extends RefactoringCommand {

    smell: GroupSmellObject;
    team: joint.shapes.microtosca.SquadGroup;

    commands: Command[];

    constructor(private graph: Graph, smell: GroupSmellObject) {
        super();
        this.smell = smell;
        this.commands = [];
    }

    refactor() {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup>this.smell.getGroup();
        this.smell.getNodeBasedCauses().forEach(node => {
            let gatewayName = "API Gateway " + node.getName();
            let addGatewayCommand = new AddMessageRouterCommand(this.graph, gatewayName);
            this.commands.push(addGatewayCommand);
            let addEdgeGatewayLinkCommand = new AddLinkCommand(this.graph, edgeGroup.getName(), gatewayName);
            this.commands.push(addEdgeGatewayLinkCommand);
            let addGatewayNodeLink = new AddLinkCommand(this.graph, gatewayName, node.getName());
            this.commands.push(addGatewayNodeLink);
            let linkToRemove = this.graph.getLinkFromSourceToTarget(edgeGroup, node);
            this.commands.push(new RemoveLinkCommand(this.graph, linkToRemove));
        });
        return this.commands;
    }

    getName() {
        return "Add Api Gateway";
    }

    getDescription() {
        let msg = "Add an Api Gateway from the external user to "
        this.smell.getNodeBasedCauses().forEach(node =>
            msg += ` ${node.getName()}`
        );
        return msg;
    }

}
export class AddMessageRouterRefactoring implements Refactoring {

    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup;

    // name of incoming nodes, name of outcoming nodes, Communication pattern
    addedSourceTargetRouters: [string, string, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
        this.addedSourceTargetRouters = [];
    }

    execute() {
        let len = this.links.length;
        for (var _i = 0; _i < len; _i++) {
            var link = this.links.pop();
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let messageRouter = this.graph.addMessageRouter(`${sourceNode.getName()} ${targetNode.getName()}`);
            this.graph.addRunTimeInteraction(sourceNode, messageRouter);
            this.graph.addRunTimeInteraction(messageRouter, targetNode);
            this.addedSourceTargetRouters.push([sourceNode.getName(), targetNode.getName(), messageRouter]);
            link.remove();
        }
    }

    unexecute() {
        let len = this.addedSourceTargetRouters.length;
        for (var _i = 0; _i < len; _i++) {
            let sourceTargetPattern = this.addedSourceTargetRouters.pop();
            let sourceNmae = sourceTargetPattern[0];
            let targetname = sourceTargetPattern[1];
            let link = this.graph.addRunTimeInteraction(this.graph.findNodeByName(sourceNmae), this.graph.findRootByName(targetname));
            this.links.push(link);
            sourceTargetPattern[2].remove();
        };
    }

    getName() {
        return "Add message router";
    }

    getDescription() {
        return "Add message router between two services";
    }

}

export class AddMessageBrokerRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup;

    addedSourceTargetbrokers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        // For wobbly service interaction, adding message broker is disable whe the target node is a communication pattern
        this.links = smell.getLinkBasedCauses().filter((link) => !(link.getTargetElement() instanceof joint.shapes.microtosca.CommunicationPattern))

        this.graph = graph;
        this.addedSourceTargetbrokers = [];
    }

    execute() {
        let len = this.links.length;
        for (var _i = 0; _i < len; _i++) {
            var link = this.links.pop();
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let messageRouter = this.graph.addMessageBroker(`${sourceNode.getName()} ${targetNode.getName()}`);
            this.graph.addRunTimeInteraction(sourceNode, messageRouter);
            this.graph.addRunTimeInteraction(targetNode, messageRouter);
            this.addedSourceTargetbrokers.push([sourceNode, targetNode, messageRouter]);
            link.remove();
        }
    }

    unexecute() {
        let len = this.addedSourceTargetbrokers.length;
        for (var _i = 0; _i < len; _i++) {
            let sourceTargetPattern = this.addedSourceTargetbrokers.pop();
            let link = this.graph.addRunTimeInteraction(sourceTargetPattern[0], sourceTargetPattern[1]);
            this.links.push(link);
            sourceTargetPattern[2].remove();
        };
    }

    getName() {
        return "Add message broker";
    }

    getDescription() {
        return "Add message broker between two services";
    }

}

export class AddServiceDiscoveryRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
    }

    execute() {
        this.links.forEach(link => {
            link.setDynamicDiscovery(true);
        })
    }

    unexecute() {
        this.links.forEach(link => {
            link.setDynamicDiscovery(false);
        })
    }

    getName() {
        return "Add service discovery";
    }

    getDescription() {
        return "Add service discovery";
    }

}

export class AddCircuitBreakerRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetCircutBeakers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
        this.addedSourceTargetCircutBeakers = [];
    }

    execute() {
        this.links.forEach(link => {
            link.setCircuitBreaker(true);
        })
    }

    unexecute() {
        this.links.forEach(link => {
            link.setCircuitBreaker(false);
        })
    }

    getName() {
        return "Add circuit breaker";
    }

    getDescription() {
        return "Add circuit breaker between two services";
    }

}

export class UseTimeoutRefactoring implements Refactoring {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
    }

    execute() {
        this.links.forEach(link => {
            link.setTimedout(true);
        });
    }

    unexecute() {
        this.links.forEach(link => {
            link.setTimedout(false);
        });
    }

    getName() {
        return "Use timeout";
    }

    getDescription() {
        return "Use timeout";
    }
}

export class MergeServicesRefactoring implements Refactoring {

    smell: SmellObject;
    graph: Graph;
    sharedDatastore: joint.shapes.microtosca.Datastore;
    mergedService: joint.shapes.microtosca.Service;
    team: joint.shapes.microtosca.SquadGroup;

    serviceIngoingOutgoing: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node[], joint.shapes.microtosca.Node[]][];


    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatastore = <joint.shapes.microtosca.Datastore>smell.getNodeBasedCauses()[0];
        this.serviceIngoingOutgoing = [];
        this._saveIncomingOutcomingNodes();

    }

    execute() {
        this.mergedService = this.graph.addService("Merged Service");
        this.graph.addRunTimeInteraction(this.mergedService, this.sharedDatastore);
        this._addLinkToMergedService();
        this._removeServicesAccessingDB();
    }

    unexecute() {
        this._restoreServicesAccesingDB();
        this._restoreLinks();
        this.mergedService.remove();
    }

    getName() {
        return "Merge services";
    }

    getDescription() {
        return "Merge the services accessing the same database";
    }

    _restoreServicesAccesingDB() {
        this.serviceIngoingOutgoing.forEach(nodeingoingOutgoing => {
            let nameDeletedService = nodeingoingOutgoing[0].getName();
            let service = this.graph.addService(nameDeletedService);
            this.graph.addRunTimeInteraction(service, this.sharedDatastore);
        });
    }

    _restoreLinks() {
        this.serviceIngoingOutgoing.forEach(nodeingoingOutgoing => {
            let nameDeletedService = nodeingoingOutgoing[0].getName();
            let service = this.graph.findRootByName(nameDeletedService);
            nodeingoingOutgoing[1].forEach(node => {
                this.graph.addRunTimeInteraction(this.graph.findRootByName(node.getName()), service);
            })
            nodeingoingOutgoing[2].forEach(node => {
                this.graph.addRunTimeInteraction(service, this.graph.findRootByName(node.getName()));
            })
        });
    }

    _removeServicesAccessingDB() {
        this.serviceIngoingOutgoing.forEach(sio => {
            sio[0].remove();
        })
    }

    _addLinkToMergedService() {
        this.serviceIngoingOutgoing.forEach(sio => {
            // ingoing node
            sio[1].forEach(node => {
                this.graph.addRunTimeInteraction(node, this.mergedService)
            })
            // outgoing node
            sio[2].forEach(node => {
                this.graph.addRunTimeInteraction(this.mergedService, node)
            })
        })
    }

    _saveIncomingOutcomingNodes() {
        this.smell.getLinkBasedCauses().forEach(link => {
            let nodeAccessDB = <joint.shapes.microtosca.Node>link.getSourceElement();
            let ingoing: joint.shapes.microtosca.Node[] = this.graph.getInboundNeighbors(nodeAccessDB);
            let outgoing: joint.shapes.microtosca.Node[] = this.graph.getOutboundNeighbors(nodeAccessDB);
            this.serviceIngoingOutgoing.push([nodeAccessDB, ingoing, outgoing]);
        });
    }
}

export class SplitDatastoreRefactoring implements Refactoring {

    graph: Graph;
    smell: SmellObject;

    sharedDatastore: joint.shapes.microtosca.Datastore;
    splittedDatastore: joint.shapes.microtosca.Datastore[];


    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatastore = <joint.shapes.microtosca.Datastore>smell.getNodeBasedCauses()[0];
        this.splittedDatastore = [];
    }


    execute() {

        this.smell.getLinkBasedCauses().forEach(link => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let newDB = this.graph.addDatastore("DB " + sourceNode.getName());
            this.splittedDatastore.push(newDB);
            link.target(newDB);
        })
        this.sharedDatastore.remove();
    }

    unexecute() {
        this.sharedDatastore = <joint.shapes.microtosca.Datastore>this.smell.getNodeBasedCauses()[0];
        this.graph.addCell(this.sharedDatastore);
        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.sharedDatastore);
        })
        this.splittedDatastore.forEach(db => db.remove())
    }

    getName() {
        return "Split datastore";
    }

    getDescription() {
        return "Split database";
    }
}
export class AddDataManagerRefactoring implements Refactoring {

    graph: Graph;
    smell: SmellObject;

    sharedDB: joint.shapes.microtosca.Datastore;
    databaseManager: joint.shapes.microtosca.Service;

    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDB = <joint.shapes.microtosca.Datastore>this.smell.getNodeBasedCauses()[0];
    }

    execute() {
        this.databaseManager = this.graph.addService("DB manager");

        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.databaseManager);
        });

        this.graph.addRunTimeInteraction(this.databaseManager, this.sharedDB);
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.sharedDB);
        });
        this.databaseManager.remove();
    }

    getName() {
        return "Add data manager";
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}

export class MoveDatastoreIntoTeamRefactoring implements Refactoring {

    smell: GroupSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    squadOfDatastore: joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: GroupSmellObject) {
        this.graph = graph;
        this.smell = smell;
        this.team = <joint.shapes.microtosca.SquadGroup>smell.getGroup();
    }

    execute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            let database = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            this.squadOfDatastore = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.squadOfDatastore.unembed(database);
            this.squadOfDatastore.fitEmbeds();
            this.team.embed(database);
            this.team.fitEmbeds();
        })
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            let database = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            this.team.unembed(database);
            this.team.fitEmbeds();
            this.squadOfDatastore.embed(database);
            this.squadOfDatastore.fitEmbeds();

        })
    }

    getName() {
        return "Move datastore into team";
    }

    getDescription() {
        return "Move the database into the team";
    }
}

export class MoveServiceIntoTeamRefactoring implements Refactoring {
    smell: GroupSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    constructor(graph: Graph, smell: GroupSmellObject) {
        this.graph = graph;
        this.smell = smell;
        this.team = <joint.shapes.microtosca.SquadGroup> smell.getGroup();
    }

    execute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            let database = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            let service = <joint.shapes.microtosca.Service>link.getSourceElement();

            let squadOfDatastore = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.team.unembed(service);
            squadOfDatastore.embed(service);
            squadOfDatastore.fitEmbeds();
            this.team.fitEmbeds();
        })
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link => {
            let database = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            let service = <joint.shapes.microtosca.Service>link.getSourceElement();
            let squadOfDatastore = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.team.embed(service);
            squadOfDatastore.unembed(service);
            squadOfDatastore.fitEmbeds();
            this.team.fitEmbeds();
        })
    }

    getName() {
        return "Move service into team";
    }

    getDescription() {
        return "Move the service into team";
    }
}

export class AddDataManagerIntoTeamRefactoring implements Refactoring {

    graph: Graph;
    smell: GroupSmellObject;

    squadOfDatastore: joint.shapes.microtosca.SquadGroup;
    databaseManager: joint.shapes.microtosca.Service;
    database: joint.shapes.microtosca.Datastore;


    constructor(graph: Graph, smell: GroupSmellObject) {
        this.smell = smell;
        this.graph = graph;
    }

    execute() {
        this.databaseManager = this.graph.addService("DB manager");

        this.smell.getLinkBasedCauses().forEach(link => {
            this.database = <joint.shapes.microtosca.Datastore>link.getTargetElement();
            this.squadOfDatastore = <joint.shapes.microtosca.SquadGroup>this.database.getParentCell();
            link.target(this.databaseManager);
            this.squadOfDatastore.embed(this.databaseManager);
            this.squadOfDatastore.fitEmbeds();
            this.graph.getIngoingLinks(this.database).forEach(link => link.target(this.databaseManager));
            this.graph.addRunTimeInteraction(this.databaseManager, this.database);
        });
        // TODO change the target node to database manager to all incoming link to database.
    }

    unexecute() {
        this.graph.getIngoingLinks(this.databaseManager).forEach(link => link.target(this.database));
        this.databaseManager.remove();
    }

    getName() {
        return "Add data manager into team";
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}


