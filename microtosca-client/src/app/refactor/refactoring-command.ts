import { Graph } from "../model/graph";
import { SmellObject, GroupSmellObject, NoApiGatewaySmellObject, SingleLayerTeamSmellObject } from '../analyser/smell';
import { Command } from "../invoker/icommand";
import * as joint from 'jointjs';

export class IgnoreOnceCommand implements Command {

    smell: SmellObject;
    node: joint.shapes.microtosca.Root;

    constructor(node: joint.shapes.microtosca.Root, smell: SmellObject) {
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

export class IgnoreAlwaysCommand implements Command {

    smell: SmellObject;
    node: joint.shapes.microtosca.Root;

    constructor(node: joint.shapes.microtosca.Root, smell: SmellObject) {
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

export class AddApiGatewayCommand implements Command {

    smell: GroupSmellObject;
    graph: Graph;

    apiGateways: joint.shapes.microtosca.CommunicationPattern[];

    constructor(graph: Graph, smell: NoApiGatewaySmellObject) {
        this.graph = graph;
        this.smell = smell;
        this.apiGateways = []
    }

    execute() {
        let edgeGroup = <joint.shapes.microtosca.EdgeGroup>this.smell.getGroup()
        this.smell.getNodeBasedCauses().forEach(node => {
            let gw = this.graph.addApiGateway("Gateway " + node.getName());
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

export class AddMessageRouterCommand implements Command {

    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

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

    getDescription() {
        return "Add message router between two services";
    }
}

export class AddMessageBrokerCommand implements Command {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetbrokers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
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

export class AddServiceDiscoveryCommand implements Command {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetServiceDiscoveries: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
        this.addedSourceTargetServiceDiscoveries = [];
    }

    execute() {
        let len = this.links.length;
        for (var _i = 0; _i < len; _i++) {
            var link = this.links.pop();
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let serviceDiscovery = this.graph.addServiceDiscovery(`${sourceNode.getName()} ${targetNode.getName()}`);
            this.graph.addRunTimeInteraction(sourceNode, serviceDiscovery);
            this.graph.addRunTimeInteraction(targetNode, serviceDiscovery);
            this.addedSourceTargetServiceDiscoveries.push([sourceNode, targetNode, serviceDiscovery]);
            link.remove();
        }

    }

    unexecute() {
        let len = this.addedSourceTargetServiceDiscoveries.length;
        for (var _i = 0; _i < len; _i++) {
            let sourceTargetPattern = this.addedSourceTargetServiceDiscoveries.pop();
            let link = this.graph.addRunTimeInteraction(sourceTargetPattern[0], sourceTargetPattern[1]);
            this.links.push(link);
            sourceTargetPattern[2].remove();
        };
    }

    getDescription() {
        return "Add service discovery";
    }

}

export class AddCircuitBreakerCommand implements Command {
    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetCircutBeakers: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

    constructor(graph: Graph, smell: SmellObject) {
        this.links = smell.getLinkBasedCauses();
        this.graph = graph;
        this.addedSourceTargetCircutBeakers = [];
    }

    execute() {
        let len = this.links.length;
        for (var _i = 0; _i < len; _i++) {
            var link = this.links.pop();
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let targetNode = <joint.shapes.microtosca.Node>link.getTargetElement();
            let circuitBeaker = this.graph.addCircuitBreaker(`${sourceNode.getName()} ${targetNode.getName()}`);
            this.graph.addRunTimeInteraction(sourceNode, circuitBeaker);
            this.graph.addRunTimeInteraction(circuitBeaker, targetNode);
            this.addedSourceTargetCircutBeakers.push([sourceNode, targetNode, circuitBeaker]);
            link.remove();
        }
    }

    unexecute() {
        let len = this.addedSourceTargetCircutBeakers.length;
        for (var _i = 0; _i < len; _i++) {
            let sourceTargetPattern = this.addedSourceTargetCircutBeakers.pop();
            let link = this.graph.addRunTimeInteraction(sourceTargetPattern[0], sourceTargetPattern[1]);
            this.links.push(link);
            sourceTargetPattern[2].remove();
        };
    }

    getDescription() {
        return "Add circuit breaker between two services";
    }

}

export class UseTimeoutCommand implements Command {
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

    getDescription() {
        return "Use timeout";
    }
}

export class MergeServicesCommand implements Command {

    smell: SmellObject;
    graph: Graph;
    sharedDatabase: joint.shapes.microtosca.Database;
    mergedService: joint.shapes.microtosca.Service

    serviceIngoingOutgoing: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node[], joint.shapes.microtosca.Node[]][];


    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatabase = smell.getNodeBasedCauses()[0];
        this.serviceIngoingOutgoing = [];
        this._saveIncomingOutcomingNodes();

    }

    execute() {
        this.mergedService = this.graph.addService("Merged Service");
        this.graph.addRunTimeInteraction(this.mergedService, this.sharedDatabase);
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
            this.graph.addRunTimeInteraction(service, this.sharedDatabase);
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

export class SplitDatabaseCommand implements Command {

    graph: Graph;
    smell: SmellObject;

    sharedDatabase: joint.shapes.microtosca.Database;
    splittedDatabase: joint.shapes.microtosca.Database[];


    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatabase = smell.getNodeBasedCauses()[0];
        this.splittedDatabase = [];
    }


    execute() {

        this.smell.getLinkBasedCauses().forEach(link => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            let newDB = this.graph.addDatabase("DB " + sourceNode.getName());
            this.splittedDatabase.push(newDB);
            link.target(newDB);
        })
        this.sharedDatabase.remove();
    }

    unexecute() {
        this.sharedDatabase = this.smell.getNodeBasedCauses()[0];
        this.graph.addCell(this.sharedDatabase);
        this.smell.getLinkBasedCauses().forEach(link => {
            link.target(this.sharedDatabase);
        })
        this.splittedDatabase.forEach(db => db.remove())
    }

    getDescription() {
        return "Split database";
    }
}
export class AddDataManagerCommand implements Command {

    graph: Graph;
    smell: SmellObject;

    sharedDB: joint.shapes.microtosca.Database;
    databaseManager: joint.shapes.microtosca.Service;

    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDB = this.smell.getNodeBasedCauses()[0];
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

export class MoveDatabaseIntoTeamCommand implements Command {

    smell: SingleLayerTeamSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    squadOfDatabase:  joint.shapes.microtosca.SquadGroup;

    constructor(graph: Graph, smell: SingleLayerTeamSmellObject) {
        this.graph = graph;
        this.smell = smell;
        this.team = smell.getGroup();
    }
    
    execute() {
        this.smell.getLinkBasedCauses().forEach(link=>{
            let database = <joint.shapes.microtosca.Database>link.getTargetElement();
            this.squadOfDatabase = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.squadOfDatabase.unembed(database);
            this.squadOfDatabase.fitEmbeds();
            this.team.embed(database);
            this.team.fitEmbeds();
        })
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link=>{
            let database = <joint.shapes.microtosca.Database>link.getTargetElement();
            this.team.unembed(database);
            this.team.fitEmbeds();
            this.squadOfDatabase.embed(database);
            this.squadOfDatabase.fitEmbeds();
            
        })
    }

    getDescription() {
        return "Move the database into the team";
    }
}

export class MoveServiceIntoTeamCommand implements Command {
    smell: SingleLayerTeamSmellObject;
    graph: Graph;
    team: joint.shapes.microtosca.SquadGroup

    constructor(graph: Graph, smell: SingleLayerTeamSmellObject) {
        this.graph = graph;
        this.smell = smell;
        this.team = smell.getGroup();
    }
    
    execute() {
        this.smell.getLinkBasedCauses().forEach(link=>{
            let database = <joint.shapes.microtosca.Database>link.getTargetElement();
            let service = <joint.shapes.microtosca.Service>link.getSourceElement();

            let squadOfDatabase = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.team.unembed(service);
            squadOfDatabase.embed(service);
            squadOfDatabase.fitEmbeds();
            this.team.fitEmbeds();
        })
    }

    unexecute() {
        this.smell.getLinkBasedCauses().forEach(link=>{
            let database = <joint.shapes.microtosca.Database>link.getTargetElement();
            let service = <joint.shapes.microtosca.Service>link.getSourceElement();
            let squadOfDatabase = <joint.shapes.microtosca.SquadGroup>database.getParentCell();
            this.team.embed(service);
            squadOfDatabase.unembed(service);
            squadOfDatabase.fitEmbeds();
            this.team.fitEmbeds();
        })
    }

    getDescription() {
        return "Move the service into team";
    }
}

export class AddDataManagerIntoTeamCommand implements Command {

    graph: Graph;
    smell: SmellObject;

    squadOfDatabase:  joint.shapes.microtosca.SquadGroup;
    databaseManager:  joint.shapes.microtosca.Service;
    database: joint.shapes.microtosca.Database;


    constructor(graph: Graph, smell: GroupSmellObject) {
        this.smell = smell;
        this.graph = graph;
    }

    execute() {
        this.databaseManager = this.graph.addService("DB manager");

        this.smell.getLinkBasedCauses().forEach(link=>{
            this.database = <joint.shapes.microtosca.Database>link.getTargetElement();
            this.squadOfDatabase = <joint.shapes.microtosca.SquadGroup>this.database.getParentCell();
            link.target(this.databaseManager);
            this.squadOfDatabase.embed(this.databaseManager);
            this.squadOfDatabase.fitEmbeds();
            this.graph.getIngoingLinks(this.database).forEach(link=>link.target(this.databaseManager));
            this.graph.addRunTimeInteraction(this.databaseManager, this.database);
        });
        // TODO change the target node to database manager to all incoming link to database.
    }

    unexecute() {
      this.graph.getIngoingLinks(this.databaseManager).forEach(link=>link.target(this.database));
      this.databaseManager.remove();
    }

    getDescription() {
        return "Add Data manger accessgin the shared  database";
    }

}
