import { Refactoring } from "./refactoring";

export class Antipattern {

    name: string;
    refactorings: Refactoring[];
    cause:Object[];

    constructor(name: string) {
        this.name = name;
    }

}