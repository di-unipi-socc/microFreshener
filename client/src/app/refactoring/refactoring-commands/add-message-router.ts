import { Graph } from "src/app/graph/model/graph";
import { SmellObject } from "../smell";
import { Refactoring } from "./refactoring-command";

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