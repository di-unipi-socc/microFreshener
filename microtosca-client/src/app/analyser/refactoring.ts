import { Antipattern } from "./antipattern";

export class Refactoring {

    name: string;
    antipatterns: Antipattern[];

    constructor(name: string) {
        this.name = name;
    }

}
