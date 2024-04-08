import { GroupSmell } from "./smell";

export class SharedBoundedContextSmellObject extends GroupSmell {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super(group);
    }

    getName(): string {
        return "Shared bounded context";
    }

    getDescription(): string {
        return this.getLinkBasedCauses().map(link => `Teams owning ${(<joint.shapes.microtosca.Node> link.getSourceElement()).getName()} and ${(<joint.shapes.microtosca.Node> link.getTargetElement()).getName()} may operate in the same bounded context.`).join("\n");
    }
}