import { Graph } from "../model/graph";
import { SmellObject } from '../analyser/smell';
import { Command } from "../invoker/icommand";
import * as joint from 'jointjs';


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

    incomingLinks: joint.shapes.microtosca.RunTimeLink[];
    graph: Graph;
    sharedDatabase: joint.shapes.microtosca.Node;

    addedSourceTargetCircutBeakers = [];

    constructor(graph: Graph, smell: SmellObject) {
        this.incomingLinks = smell.getLinkBasedCauses();
        this.sharedDatabase = this.getDatabase();
        this.graph = graph;
    }

    execute() {
        let dbmanager = this.graph.addService("Data manager");
        this.graph.addRunTimeInteraction(dbmanager, this.sharedDatabase);

        let nodes = this.getNodesAccessingDatabase();
        nodes.forEach(nodeAccessDB => {
            let inbound = this.graph.getInboundNeighbors(nodeAccessDB);
            let outbound = this.graph.getOutboundNeighbors(nodeAccessDB);
            inbound.forEach(inboundNode => {
                this.graph.addRunTimeInteraction(inboundNode, dbmanager);
            })
            outbound.forEach(outboundNode => {
                this.graph.addRunTimeInteraction(dbmanager, outboundNode);
            })
            nodeAccessDB.remove();
        })

    }

    unexecute() {
        // tranform a link in a runtim link
    }


    getDatabase() {
        if (this.incomingLinks.length > 0)
            return <joint.shapes.microtosca.Node>this.incomingLinks[0].getTargetElement();
        else
            return null;
    }

    getNodesAccessingDatabase() {
        let nodes = [];
        this.incomingLinks.forEach(link => {
            let sourceNode = <joint.shapes.microtosca.Node>link.getSourceElement();
            if (nodes.find(node => node.getName() === sourceNode.getName()) === undefined) {
                nodes.push(sourceNode);
            }
        })
        return nodes;
    }

}
