import * as joint from 'jointjs';
import { Refactoring } from '../refactorings/refactoring-command';

export interface Smell {
    getName(): string;
    getDescription(): string;
    getNodeBasedCauses(): joint.shapes.microtosca.Node[];
    getLinkBasedCauses(): joint.dia.Link[];
    getRefactorings(): Refactoring[];
}

abstract class SmellObject implements Smell {

    protected name: string;
    protected refactorings: Refactoring[];
    protected linksCause: joint.dia.Link[];
    protected nodesCause: joint.shapes.microtosca.Node[];

    constructor() {
        this.linksCause = [];
        this.refactorings = [];
        this.nodesCause = [];
    }

    abstract getName(): string;

    abstract getDescription(): string;

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
        if(refactoring)
            this.refactorings.push(refactoring);
    }

    getRefactorings(): Refactoring[] {
        return this.refactorings;
    }
}

export abstract class NodeSmell extends SmellObject {
    abstract getName();
    abstract getDescription();
}

export abstract class GroupSmell extends SmellObject {

    constructor(protected group:joint.shapes.microtosca.Group) {
        super();
    }

    abstract getName();
    abstract getDescription();

    getGroup():joint.shapes.microtosca.Group{
        return this.group;
    }

}
