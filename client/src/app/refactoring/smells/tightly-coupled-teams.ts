import * as joint from 'jointjs';
import { GroupSmell } from './smell';


export class TightlyCoupledTeamsSmellObject extends GroupSmell {

    constructor(group: joint.shapes.microtosca.SquadGroup) {
        super(group);
    }

    getName() {
        return "Tightly coupled teams";
    }

    getDescription(): string {
        return `${this.getNodeBasedCauses().map((n) => n.getName()).join(", ")} node${this, this.getNodeBasedCauses().length != 1 ? "s are" : " is"} more coupled to other teams than the current owner.`;
    }

}
