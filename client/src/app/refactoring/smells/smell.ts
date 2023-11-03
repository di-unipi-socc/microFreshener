import * as joint from 'jointjs';
import { GroupRefactoring, Refactoring } from '../refactorings/refactoring-command';

export interface ISmell {
    getName(): string;
    getDescription(): string;
    addNodeBasedCause(node: joint.shapes.microtosca.Node);
    getNodeBasedCauses(): joint.shapes.microtosca.Node[];
    addLinkBasedCause(link: joint.shapes.microtosca.RunTimeLink);
    getLinkBasedCauses(): joint.shapes.microtosca.RunTimeLink[];
    addRefactoring(refactoring: Refactoring);
    getRefactorings(): Refactoring[];
}

export class SmellObject implements ISmell {

    name: string;
    refactorings: Refactoring[];
    linksCause: joint.shapes.microtosca.RunTimeLink[];
    nodesCause: joint.shapes.microtosca.Node[];

    constructor(name: string, private group?:joint.shapes.microtosca.Group) {
        this.name = name;
        this.linksCause = [];
        this.refactorings = [];
        this.nodesCause = [];
    }

    getName() {
        return this.name;
    }

    getGroup(): joint.shapes.microtosca.Group{
        return this.group;
    }

    addNodeBasedCause(node) {
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

            descr += `Interaction from ${source.getName()} to ${target.getName()}.\n`;
        })
        return descr;
    }
}

export class GroupSmellObject implements ISmell {

    name: string;

    group: joint.shapes.microtosca.Group;

    refactorings: Refactoring[];
    linksCause: joint.shapes.microtosca.RunTimeLink[];
    nodesCause: joint.shapes.microtosca.Node[];

    memberSmells: Map<joint.shapes.microtosca.Node, SmellObject>;

    constructor(name: string, group:joint.shapes.microtosca.Group) {
        this.name = name;
        this.group = group;
        this.linksCause = [];
        this.refactorings = [];
        this.nodesCause = [];
        this.memberSmells = new Map<joint.shapes.microtosca.Node, SmellObject>();
    }

    getName() {
        return this.name;
    }

    getGroup():joint.shapes.microtosca.Group{
        return this.group;
    }

    addNodeBasedCause(node) {
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

    addRefactoring(refactoring: (Refactoring | GroupRefactoring)) {
        // Add refactoring to whole group
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

            descr += `Interaction from ${source.getName()} to ${target.getName()}.\n`;
        })
        return descr;
    }

    getSubSmells(): Map<joint.shapes.microtosca.Node, SmellObject> {
        return this.memberSmells;
    }

    setSubSmells(smells: Map<joint.shapes.microtosca.Node, SmellObject>) {
        this.memberSmells = smells;
    }
}
