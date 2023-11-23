import * as joint from 'jointjs';
import { GroupSmellObject } from './smell';


export class TightlyCoupledTeamsSmellObject extends GroupSmellObject {

    constructor(group: joint.shapes.microtosca.SquadGroup) {
        super("Tightly coupled teams", group);
    }

    getDescription(): string {
        return `${this.getNodeBasedCauses().map((n) => n.getName()).join(", ")} node${this, this.getNodeBasedCauses().length != 1 ? "s are" : " is"} more coupled to other teams than the current owner.`;
    }

}
