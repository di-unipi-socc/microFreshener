import { Refactoring } from "../refactor/refactoring";
import * as joint from 'jointjs';

export class SmellObject {

    name: string;
    refactorings: Refactoring[];
    linksCause: joint.shapes.microtosca.RunTimeLink[];
    nodesCause: joint.shapes.microtosca.Node[];

    constructor(name: string) {
        this.name = name;
        this.linksCause = [];
        this.refactorings = [];
        this.nodesCause = [];
    }

    getName() {
        return this.name;
    }

    addNodeBasedCuase(node) {
        this.nodesCause.push(node);
    }

    getNodeBasedCauses() {
        return this.nodesCause;
    }
    addLinkBasedCause(link) {
        this.linksCause.push(link);
    }

    getLinkBasedCauses() {
        return this.linksCause;
    }

    addRefactoring(refactoring: Refactoring) {
        this.refactorings.push(refactoring);
    }

    getRefactorings(): Refactoring[] {
        return this.refactorings;
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Root>link.getSourceElement();
            let target = <joint.shapes.microtosca.Root>link.getTargetElement();

            descr += `Interaction from  ${source.getName()} to ${target.getName()} \n`;
        })
        return descr;
    }
}

export class GroupSmellObject {

    name: string;

    group: joint.shapes.microtosca.Group;

    refactorings: Refactoring[];
    linksCause: joint.shapes.microtosca.RunTimeLink[];
    nodesCause: joint.shapes.microtosca.Node[];

    constructor(name: string, group:joint.shapes.microtosca.Group) {
        this.name = name;
        this.group = group;
        this.linksCause = [];
        this.refactorings = [];
        this.nodesCause = [];
    }

    getName() {
        return this.name;
    }

    getGroup():joint.shapes.microtosca.Group{
        return this.group;
    }

    addNodeBasedCuase(node) {
        this.nodesCause.push(node);
    }

    getNodeBasedCauses() {
        return this.nodesCause;
    }
    addLinkBasedCause(link) {
        this.linksCause.push(link);
    }

    getLinkBasedCauses() {
        return this.linksCause;
    }

    addRefactoring(refactoring: Refactoring) {
        this.refactorings.push(refactoring);
    }

    getRefactorings(): Refactoring[] {
        return this.refactorings;
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Root>link.getSourceElement();
            let target = <joint.shapes.microtosca.Root>link.getTargetElement();

            descr += `Interaction from  ${source.getName()} to ${target.getName()} \n`;
        })
        return descr;
    }
}


export class NoApiGatewaySmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.Group) {
        super("NoAPiGatewaySmell", group);
    }

    getDescription(){
        let msg = "The node "
        this.getNodeBasedCauses().forEach(node=>{
            msg+= ` ${node.getName()}`
        })
        msg += " is accessed by external users without an Api Gateway."
        return msg;
    }
}

export class EndpointBasedServiceInteractionSmellObject extends SmellObject {

    constructor() {
        super("EndpointBasedServiceInterationSmell");
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Root>link.getSourceElement();
            let target = <joint.shapes.microtosca.Root>link.getTargetElement();

            descr += `Interaction from  ${source.getName()} to ${target.getName()} \n`;
        })
        return descr;
    }
}

export class SharedPersistencySmellObject extends SmellObject {
    constructor() {
        super("SharedPersistencySmell");
    }
}
export class WobblyServiceInteractionSmellObject extends SmellObject {

    constructor() {
        super("WobblyServiceInteractonSmell");
    }
}

export class SingleLayerTeamSmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super("SingleLayerTeamSmell", group);
    }
}

export class MultipleServicesInOneContainerSmellObject extends SmellObject {
    constructor() {
        super("MultipleServicesInOneContainerSmell")
    }
}