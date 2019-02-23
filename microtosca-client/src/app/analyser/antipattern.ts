import { Refactoring } from "./refactoring";

export class Antipattern {

    name: string;
    refactorings: Refactoring[];
    // cause

    constructor(name: string) {
        this.name = name;
    }

}