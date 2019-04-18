import { SmellObject } from './smell';

/**
 * Analysed group. Contains the violated principles of a group-based smell
 */
export class AGroup {

    name: string; // name of the group
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

    static fromJSON(data: string) {
        var agroup: AGroup = new AGroup(data['name']);
        data['smells'].forEach((smell) => {
            var s: SmellObject = new SmellObject(smell.name);
            smell['cause'].forEach((node_name) => {
                s.addNodeBasedCuase(node_name);
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