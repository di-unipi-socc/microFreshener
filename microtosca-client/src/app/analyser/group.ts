import { GroupSmellObject } from './smell';

/**
 * Analysed group. Contains the violated principles of a group-based smell
 */
export class AGroup {

    name: string; // name of the group
    smells: GroupSmellObject[];

    constructor(name: string) {
        this.name = name;
        this.smells = [];
    }

    addSmell(smell: GroupSmellObject) {
        this.smells.push(smell);
    }

    getSmells() {
        return this.smells;
    }

    hasSmells(): boolean {
        return this.smells.length > 0;
    }

}