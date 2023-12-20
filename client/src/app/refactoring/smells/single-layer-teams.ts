import { GroupSmellObject } from "./smell";

export class SingleLayerTeamsSmellObject extends GroupSmellObject {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super("Single-layer teams", group);
    }

    getDescription(): string {
        let services = new Set<joint.shapes.microtosca.Service>();
        console.debug("Link based causes are", this.getLinkBasedCauses())
        this.getLinkBasedCauses().forEach(link => { services.add(<joint.shapes.microtosca.Service>link.getSourceElement()); console.debug(`${(<joint.shapes.microtosca.Node> link.getSourceElement()).getName()} added`) });
        return `Data related to ${Array.from(services).map((service) => service.getName()).join(", ")} is being managed by other teams.\n`;
    }
}