import { Refactoring } from "./refactoring";

export class Smell {

    name: string;
    refactorings: Refactoring[];
    cause:Object[];

    constructor(name: string) {
        this.name = name;
        this.cause = [];
    }

    addCause(causa:Object){
        this.cause.push(causa);
    }

    getCause(){
        return this.cause;
    }

}