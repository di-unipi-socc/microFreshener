import { Smell } from "../smells/smell";
import { Refactoring } from "./refactoring-command";


export class IgnoreAlwaysRefactoring implements Refactoring {

    smell: Smell;
    element: joint.shapes.microtosca.Sniffable;

    constructor(element: joint.shapes.microtosca.Sniffable, smell: Smell) {
        this.smell = smell;
        this.element = element;
    }

    execute() {
        this.element.ignoreAlways(this.smell);
    }

    unexecute() {
        this.element.undoIgnoreAlways(this.smell);
    }

    getName() {
        return "Ignore always";
    }

    getCommand() {
        return this;
    }

    getDescription() {
        return "Ignore the smell forever.";
    }

}