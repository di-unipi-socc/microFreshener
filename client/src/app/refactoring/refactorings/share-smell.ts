import { Smell } from "../smells/smell";
import { Refactoring } from "./refactoring-command";

export class ShareSmellRefactoring implements Refactoring {

    constructor(private element: joint.shapes.microtosca.Root, private smell: Smell) {}

    execute() {
        let name = `Found smell ${this.smell.getName()}`;
        let desc = `Smell description: ${this.smell.getDescription()}`;
        let nodeCauses = this.smell.getNodeBasedCauses();
        let nodeCausesMsg = nodeCauses.length > 0 ? `The nodes causing this smell are ${nodeCauses.map((n) => n.getName()).join(", ")}` : "There no nodes causing this smell.";
        let linkCauses = this.smell.getLinkBasedCauses();
        let linkCausesMsg = linkCauses.length > 0 ? `The links causing this smell are ${linkCauses.map((l) => `${(<joint.shapes.microtosca.Node> l.getSourceElement()).getName()} -> ${(<joint.shapes.microtosca.Node> l.getTargetElement()).getName()}`).join(", ")}` : "There are no links causing this smell.";
        navigator.clipboard.writeText(name + "\n" + desc + "\n" + nodeCausesMsg + "\n" + linkCausesMsg);
    }

    unexecute() {}

    getName() {
        return "Share smell";
    }

    getDescription() {
        return "Copy the smell information to the clipboard.";
    }

}