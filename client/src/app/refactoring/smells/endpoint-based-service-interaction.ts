import { SmellObject } from "./smell";

export class EndpointBasedServiceInteractionSmellObject extends SmellObject {

    constructor() {
        super("EndpointBasedServiceInterationSmell");
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Root>link.getSourceElement();
            let target = <joint.shapes.microtosca.Root>link.getTargetElement();

            descr += `Interaction from ${source.getName()} to ${target.getName()}.\n`;
        })
        return descr;
    }
}