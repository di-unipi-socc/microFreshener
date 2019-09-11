import { Graph } from "../model/graph";
import { SmellObject, GroupSmellObject, NoApiGatewaySmellObject, SingleLayerTeamSmellObject } from '../analyser/smell';
import { Command } from "../invoker/icommand";
import * as joint from 'jointjs';

export  abstract class RefactoringCommand implements Command {

    execute() {        
    }

    unexecute() {
    }

}

export class IgnoreOnceCommand extends RefactoringCommand {

    smell: SmellObject;
    node: joint.shapes.microtosca.Root;

    constructor(node: joint.shapes.microtosca.Root, smell: SmellObject) {
        super();
        this.smell = smell;
        this.node = node;
    }

    execute() {
        this.node.ignoreOnce(this.smell);
    }

    unexecute() {
        this.node.showSmell(this.smell);
    }


    getDescription() {
        return "Ignore the smell";
    }
}

export class IgnoreAlwaysCommand extends RefactoringCommand {

    smell: SmellObject;
    node: joint.shapes.microtosca.Root;

    constructor(node: joint.shapes.microtosca.Root, smell: SmellObject) {
        super();
        this.smell = smell;
        this.node = node;
    }

    execute() {
        this.node.addIgnoreAlwaysSmell(this.smell);
    }

    unexecute() {
        this.node.showSmell(this.smell);
    }


    getDescription() {
        return "Ignore the smell forever.";
    }
}

export class AddApiGatewayCommand extends RefactoringCommand {

    smell: GroupSmellObject;
    graph: Graph;

    apiGateways: joint.shapes.microtosca.CommunicationPattern[];

    constructor(graph: Graph, smell: NoApiGatewaySmellObject) {
        super();

        this.smell = smell;
        this.apiGateways = []
    }

    execute() {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup>this.smell.getGroup()
        this.smell.getNodeBasedCauses().forEach(node => {
            let gw = this.graph.addMessageRouter("API Gateway " + node.getName());
            this.graph.addRunTimeInteraction(gw, node);
            this.graph.addRunTimeInteraction(edgeGroup, gw);
            this.apiGateways.push(gw);
            this.graph.getLinkFromSourceToTarget(edgeGroup, node).remove();
        });
    }

    unexecute() {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup>this.smell.getGroup()

        this.smell.getNodeBasedCauses().forEach(node => {
            this.graph.addRunTimeInteraction(edgeGroup, node);
        });

        this.apiGateways.forEach(gw => gw.remove());

    }

    getDescription() {
        let msg = "Add an Api Gateway from the external user to "
        this.smell.getNodeBasedCauses().forEach(node =>
            msg += ` ${node.getName()}`
        );
        return msg;
    }
}
export class AddMessageRouterCommand extends RefactoringCommand {

    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    // name of incoming nodes, name of outcoming nodes, Communication pattern
    addedSourceTargetRouters: [string, string, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Add message router between two services";
    }
}

export class AddMessageBrokerCommand extends RefactoringCommand {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetbrokers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Add message broker between two services";
    }

}

export class AddServiceDiscoveryCommand extends RefactoringCommand {
    links: joint.shapes.microtosca.RunTimeLink[];

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Add service discovery";
    }

}

export class AddCircuitBreakerCommand extends RefactoringCommand {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetCircutBeakers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Add circuit breaker between two services";
    }

}

export class UseTimeoutCommand extends RefactoringCommand {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Use timeout";
    }
}

export class MergeServicesCommand extends RefactoringCommand {

    smell: SmellObject;
    graph: Graph;
    sharedDatastore: joint.shapes.microtosca.Datastore;
    mergedService: joint.shapes.microtosca.Service

    serviceIngoingOutgoing: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node[], joint.shapes.microtosca.Node[]][];


    constructor(graph: Graph, smell: SmellObject) {
        super();

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

export class SplitDatastoreCommand extends RefactoringCommand {

    graph: Graph;
    smell: SmellObject;

    sharedDatastore: joint.shapes.microtosca.Datastore;
    splittedDatastore: joint.shapes.microtosca.Datastore[];


    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Split database";
    }
}
export class AddDataManagerCommand extends RefactoringCommand {

    graph: Graph;
    smell: SmellObject;

    sharedDB: joint.shapes.microtosca.Datastore;
    databaseManager: joint.shapes.microtosca.Service;

    constructor(graph: Graph, smell: SmellObject) {
        super();

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

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}

export class MoveDatastoreIntoTeamCommand extends RefactoringCommand {

    smell: SingleLayerTeamSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    squadOfDatastore: joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: SingleLayerTeamSmellObject) {
        super();

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

    getDescription() {
        return "Move the database into the team";
    }
}

export class MoveServiceIntoTeamCommand extends RefactoringCommand {
    smell: SingleLayerTeamSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    constructor(graph: Graph, smell: SingleLayerTeamSmellObject) {
        super();

        this.graph = graph;
        this.smell = smell;
        this.team = <joint.shapes.microtosca.SquadGroup>smell.getGroup();
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

    getDescription() {
        return "Move the service into team";
    }
}

export class AddDataManagerIntoTeamCommand extends RefactoringCommand {

    graph: Graph;
    smell: SmellObject;

    squadOfDatastore: joint.shapes.microtosca.SquadGroup;
    databaseManager: joint.shapes.microtosca.Service;
    database: joint.shapes.microtosca.Datastore;


    constructor(graph: Graph, smell: GroupSmellObject) {
        super();

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

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}


