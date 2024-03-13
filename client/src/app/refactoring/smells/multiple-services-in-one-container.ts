import { NodeSmell } from "./smell";

export class MultipleServicesPerDeploymentUnitSmellObject extends NodeSmell {

    getName() {
        return "Multiple services per deployment unit";
    }

    getDescription() {
        return `${this.getLinkBasedCauses().map((link) => <joint.shapes.microtosca.Node> link.getSourceElement()).map((node) => node.getName()).join(", ")} share their deployment unit with other nodes.`;
    }
    
}