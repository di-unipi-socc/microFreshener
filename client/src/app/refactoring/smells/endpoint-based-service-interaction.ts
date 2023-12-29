import { NodeSmell } from "./smell";

export class EndpointBasedServiceInteractionSmellObject extends NodeSmell {

    getName() {
        return "EndpointBasedServiceInterationSmell"
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Node>link.getSourceElement();
            let target = <joint.shapes.microtosca.Node>link.getTargetElement();

            descr += `The interaction from ${source.getName()} to ${target.getName()} is based on endpoints.\n`;
        })
        return descr;
    }
}