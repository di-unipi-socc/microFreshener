import { GroupSmell } from "./smell";

export class NoApiGatewaySmellObject extends GroupSmell {

    constructor(group: joint.shapes.microtosca.EdgeGroup) {
        super(group);
    }

    getName() {
        return "NoAPiGatewaySmell";
    }

    getDescription(){
        let nodes = this.getNodeBasedCauses().map((n) => n.getName());
        return `The node${nodes.length != 1 ? "s" : ""} ${nodes.join(", ")} ${nodes.length != 1 ? "are" : "is"} accessed by the external users without an API Gateway.`
    }
}