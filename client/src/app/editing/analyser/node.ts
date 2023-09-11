import { SmellObject } from './smell';

/**
 * Analysed node. Contains the violated principles of the nodes
 */
export class ANode {

    name: string;
    smells: SmellObject[];

    constructor(name: string) {
        this.name = name;
        this.smells = [];
    }

    addSmell(smell: SmellObject) {
        this.smells.push(smell);
    }

    getSmells() {
        return this.smells;
    }

    hasSmells(): boolean {
        return this.smells.length > 0;
    }

}