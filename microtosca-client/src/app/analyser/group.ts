import { Principle } from "./principles"
import * as joint from "jointjs";
import { Smell } from './smell';


/**
 * Analysed group. Contains the violated principles of a group-based smell
 */
export class AGroup {

    name: string; // name of the group
    smells: Smell[];

    constructor(name: string) {
        this.name = name;
        this.smells = [];
    }

    addSmell(smell: Smell) {
        this.smells.push(smell);
    }

    getSmells() {
        return this.smells;
    }

    hasSmells(): boolean {
        return this.smells.length > 0;
    }

    static fromJSON(data: string) {
        var agroup: AGroup = new AGroup(data['name']);
        data['smells'].forEach((smell) => {
            var s: Smell = new Smell(smell.name);
            smell['cause'].forEach((causa) => {
                s.addCause(causa);
            });
            if (smell['refactorings']) {
                smell['refactorings'].forEach((ref) => {
                    s.addRefactoring(ref);
                });
            }
            agroup.addSmell(s);
        });
        return agroup;
    }

}