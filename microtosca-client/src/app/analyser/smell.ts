
import {Causa} from "./causa";
import {IRefactoring} from "../refactor/irefactoring";

export class Smell {

    name: string;
    refactorings: IRefactoring[];
    cause:Causa[];

    constructor(name:string) {
        this.name = name;
        this.cause = [];
        this.refactorings = [];
    }

    addCause(causa:Causa){
        this.cause.push(causa);
    }

    getCause(){
        return this.cause;
    }

    addRefactoring(refactoring:IRefactoring){
        this.refactorings.push(refactoring);
    }
    
    getRefactorings(){
        return this.refactorings;
    }

    getDescription():string{
        var descr = "";
        this.cause.forEach(causa=>{
            descr +=  `${causa['type']} interaction from  ${causa['source']} to ${causa['target']} \n`;
        })
        return descr;
    }
}