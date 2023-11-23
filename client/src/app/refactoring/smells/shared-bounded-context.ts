import { GroupSmellObject } from "./smell";

export class SharedBoundedContextSmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super("Shared bounded context", group);
    }

    getDescription(): string {
        return this.getLinkBasedCauses().map(link => `Teams owning ${(<joint.shapes.microtosca.Node> link.getSourceElement()).getName()} and ${(<joint.shapes.microtosca.Node> link.getTargetElement()).getName()} may operate in the same bounded context.`).join("\n");
    }
}