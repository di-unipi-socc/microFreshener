import { GroupSmellObject } from "./smell";

export class SingleLayerTeamsSmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super("Single-layer teams", group);
    }

    getDescription(): string {
        let services = new Set<joint.shapes.microtosca.Root>();
        this.getLinkBasedCauses().forEach(link => { services.add(<joint.shapes.microtosca.Root>link.getSourceElement()) });
        return `Data related to ${Array.from(services).map((service) => service.getName()).join(", ")} is being managed by other teams.\n`;
    }
}