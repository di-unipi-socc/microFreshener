import { GroupSmell } from "./smell";

export class SingleLayerTeamsSmellObject extends GroupSmell {

    constructor(group:joint.shapes.microtosca.SquadGroup) {
        super(group);
    }

    getName(): string {
        return "Single-layer teams";
    }

    getDescription(): string {
        let services = new Set<joint.shapes.microtosca.Service>();
        this.getLinkBasedCauses().forEach(link => { services.add(<joint.shapes.microtosca.Service>link.getSourceElement()); console.debug(`${(<joint.shapes.microtosca.Node> link.getSourceElement()).getName()} added`) });
        return `Data related to ${Array.from(services).map((service) => service.getName()).join(", ")} is being managed by other teams.\n`;
    }
}