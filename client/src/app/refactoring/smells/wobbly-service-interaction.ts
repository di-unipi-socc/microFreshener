import { NodeSmell } from "./smell";

export class WobblyServiceInteractionSmellObject extends NodeSmell {

    getName() {
        return "Wobbly service interaction"
    }

    getDescription(): string {
        var descr = "";
        this.getLinkBasedCauses().forEach(link => {
            let source = <joint.shapes.microtosca.Node>link.getSourceElement();
            let target = <joint.shapes.microtosca.Node>link.getTargetElement();

            descr += `The interaction from ${source.getName()} to ${target.getName()} is wobbly.\n`;
        })
        return descr;
    }

}