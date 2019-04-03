import { Refactoring } from "./refactoring";

export class Smell {

    name: string;
    refactorings: Object[];
    cause:Object[];

    constructor(name:string) {
        this.name = name;
        this.cause = [];
        this.refactorings = [];
    }

    addRefactoring(reafctor:Object){
        this.refactorings.push(reafctor);
    }
    getRefactorings(){
        return this.refactorings;
    }

    addCause(causa:Object){
        this.cause.push(causa);
    }

    getCause(){
        return this.cause;
    }

    getDescription():string{
        var descr = "";
        this.cause.forEach(causa=>{
            descr +=  `${causa['type']} interaction from  ${causa['source']} to ${causa['target']} \n`;
        })

        return descr;
    }
}