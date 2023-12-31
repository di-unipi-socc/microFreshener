import { NodeSmell } from "./smell";

export class MultipleServicesInOneContainerSmellObject extends NodeSmell {

    getName() {
        return "Multiple services in one container";
    }

    getDescription() {
        return `${this.getNodeBasedCauses().map((node) => node.getName()).join(", ")} share their container.`;
    }
    
}