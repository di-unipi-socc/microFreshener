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

    static fromJSON(data: string) {
        var anode: ANode = new ANode(data['name']);
        data['smells'].forEach((smell) => {
            var s: SmellObject = new SmellObject(smell.name);
            smell['cause'].forEach((causa) => {
                s.addLinkBasedCause(causa);
            });
            if (smell['refactorings']) {
                smell['refactorings'].forEach((ref) => {
                    s.addRefactoring(ref);
                });
            }
            anode.addSmell(s);
        });
        return anode;
    }

}