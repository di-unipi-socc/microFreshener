import {IRefactoring} from "../refactor/irefactoring";
import {AddMessageRouterRefactoring} from "../refactor/refactoring";

export class Smell {

    name: string;
    refactorings: IRefactoring[];
    cause:Object[];

    constructor(name:string) {
        this.name = name;
        this.cause = [];
        this.refactorings = [];
    }

    addRefactoring(refactor:IRefactoring){
        this.refactorings.push(refactor);
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