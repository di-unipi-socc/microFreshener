import { ISmell } from "../smells/smell";
import { Refactoring } from "./refactoring-command";

export class IgnoreOnceRefactoring implements Refactoring {

    smell: ISmell;
    element: joint.shapes.microtosca.Sniffable;

    constructor(element: (joint.shapes.microtosca.Node | joint.shapes.microtosca.SquadGroup), smell: ISmell) {
        this.smell = smell;
        this.element = element;
    }

    execute() {
        this.element.removeSmell(this.smell);
    }

    unexecute() {
        this.element.addSmell(this.smell);
    }

    getName() {
        return "Ignore once";
    }

    getDescription() {
        return "Ignore the smell";
    }

}

export class IgnoreAlwaysRefactoring implements Refactoring {

    smell: ISmell;
    element: joint.shapes.microtosca.Sniffable;

    constructor(element: (joint.shapes.microtosca.Node | joint.shapes.microtosca.SquadGroup), smell: ISmell) {
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