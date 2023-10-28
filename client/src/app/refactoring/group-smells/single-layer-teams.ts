import { GroupSmellObject } from "../smell";

export class SingleLayerTeamsSmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super("Single-layer teams", group);
    }

    getDescription(): string {
        let services = new Set<joint.shapes.microtosca.Root>();
        this.getLinkBasedCauses().forEach(link => { services.add(<joint.shapes.microtosca.Root>link.getSourceElement()) });
        return `${this.group.getName()} may lack some skills since there are services that access data owned by other teams: ${Array.from(services).map((service) => service.getName()).join(", ")}.`;
    }
}