import { NodeSmell } from "./smell";

export class MultipleServicesInOneContainerSmellObject extends NodeSmell {

    getName() {
        return "Multiple services in one container";
    }

    getDescription() {
        return `${this.getLinkBasedCauses().map((link) => <joint.shapes.microtosca.Node> link.getSourceElement()).map((node) => node.getName()).join(", ")} share their container with other nodes.`;
    }
    
}