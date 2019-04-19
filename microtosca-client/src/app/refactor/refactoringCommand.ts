import { Graph } from "../model/graph";
import { SmellObject } from '../analyser/smell';
import { Command } from "../invoker/icommand";
import * as joint from 'jointjs';
import { Smell } from '../model/smell';


export class AddMessageRouterCommand implements Command {

    links: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;

    addedSourceTargetRouters: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node, joint.shapes.microtosca.CommunicationPattern][];

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
            let messageRouter = this.graph.addMessageRouter("prova");
            this.graph.addRunTimeInteraction(sourceNode, messageRouter);
            this.graph.addRunTimeInteraction(messageRouter, targetNode);
            this.addedSourceTargetRouters.push([sourceNode, targetNode, messageRouter]);
            link.remove();
        }
    }

    unexecute() {
        let len = this.addedSourceTargetRouters.length;
        for (var _i = 0; _i < len; _i++) {
            let sourceTargetPattern = this.addedSourceTargetRouters.pop();
            let link = this.graph.addRunTimeInteraction(sourceTargetPattern[0], sourceTargetPattern[1]);
            this.links.push(link);
            sourceTargetPattern[2].remove();
        };

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
            let messageRouter = this.graph.addMessageBroker("prova");
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
            let serviceDiscovery = this.graph.addServiceDiscovery("prova");
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
            let circuitBeaker = this.graph.addCircuitBreaker("prova");
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

}

export class MergeServicesCommand implements Command {

    smell: SmellObject;
    graph: Graph;
    sharedDatabase: joint.shapes.microtosca.Database;
    mergedService: joint.shapes.microtosca.Service

    deleteServices: joint.shapes.microtosca.Service[];

    serviceIngoingOutgoing: [joint.shapes.microtosca.Node, joint.shapes.microtosca.Node[], joint.shapes.microtosca.Node[]][];

    constructor(graph: Graph, smell: SmellObject) {
        this.smell = smell;
        this.graph = graph;
        this.sharedDatabase = smell.getNodeBasedCauses()[0];
        this.deleteServices = []
        this.serviceIngoingOutgoing  =[];
    }

    execute() {
        this.mergedService = this.graph.addService("Merged Service");
        this.graph.addRunTimeInteraction(this.mergedService, this.sharedDatabase);

        this.smell.getLinkBasedCauses().forEach(link => {
            let nodeAccessDB = <joint.shapes.microtosca.Node>link.getSourceElement();
            let outgoing:joint.shapes.microtosca.Node[] = this.graph.getOutboundNeighbors(nodeAccessDB);
            let ingoing:joint.shapes.microtosca.Node[] = this.graph.getInboundNeighbors(nodeAccessDB);

            this.serviceIngoingOutgoing.push([nodeAccessDB, ingoing, outgoing])
           
            outgoing.forEach(node=>{
                this.graph.addRunTimeInteraction(this.mergedService, node)
            })

            ingoing.forEach(node=>{
                this.graph.addRunTimeInteraction(node,this.mergedService)
            })
           
            nodeAccessDB.remove();  
        })
    }

    unexecute() {
       //TODO: executemethod donot work
        this.serviceIngoingOutgoing.forEach(nodeingoingOutgoing=>{
            let service = this.graph.addService(nodeingoingOutgoing[0].getName());
            nodeingoingOutgoing[1].forEach(node=>{
                this.graph.addRunTimeInteraction(node, service);
            })
            nodeingoingOutgoing[2].forEach(node=>{
                this.graph.addRunTimeInteraction(service, node);
            })
            this.graph.addRunTimeInteraction(service,this.sharedDatabase);
        });
        this.mergedService.remove()
        
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

}


