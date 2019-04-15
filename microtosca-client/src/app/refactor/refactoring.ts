import {IRefactoring} from "./irefactoring";
import {Graph} from "../model/graph";
import * as joint from 'jointjs';

 export class AddMessageRouterRefactoring implements IRefactoring{
    link:joint.shapes.microtosca.RunTimeLink;
    graph: Graph;

    sourceNode;
    targetNode;

    constructor(graph: Graph, link: joint.shapes.microtosca.RunTimeLink) {
        this.link = link;
        this.graph = graph;
    }

    execute(){
        this.sourceNode = this.link.getSourceElement();
        this.targetNode = this.link.getTargetElement();
        let newMr = this.graph.addMessageRouter("prova");
        this.graph.addRunTimeInteraction(this.sourceNode, newMr);
        this.graph.addRunTimeInteraction(newMr, this.targetNode);
        this.link.remove();
    }

    unexecute(){   
        this.link = this.graph.addRunTimeInteraction(this.sourceNode, this.targetNode);
        this.graph.findNodeByName("prova").remove();
    }

}

export class AddMessageBrokerRefactoring implements IRefactoring{
    link:joint.shapes.microtosca.RunTimeLink;
    graph: Graph;

    sourceNode;
    targetNode;

    constructor(graph: Graph, link: joint.shapes.microtosca.RunTimeLink) {
        this.link = link;
        this.graph = graph;
    }

    execute(){
        this.sourceNode = this.link.getSourceElement();
        this.targetNode = this.link.getTargetElement();
        let messageBroker = this.graph.addMessageBroker("prova");
        this.graph.addRunTimeInteraction(this.sourceNode, messageBroker);
        this.graph.addRunTimeInteraction(this.targetNode, messageBroker);
        this.link.remove();
    }

    unexecute(){   
        this.link = this.graph.addRunTimeInteraction(this.sourceNode, this.targetNode);
        this.graph.findNodeByName("prova").remove();
    }

}