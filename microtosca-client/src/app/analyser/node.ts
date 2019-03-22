import {Principle} from "./principles"
import * as joint from "jointjs";
import { Antipattern } from './antipattern';
import { Smell } from './smell';


/**
 * Analysed node. Contains the violated principles of the nodes
 */
export class ANode {

    violatedPrinciples: Principle[];
    name: string;
    smells: Smell[];
    id: string;

    constructor(name:string, id:string) {
        this.name = name;
        this.id = id;
        // TODO: to be reomoved beacuse a node has only the list of smells and not the principles
        this.violatedPrinciples = [];
        this.smells = [];
    }
   
    addSmell(smell:Smell){
        this.smells.push(smell);
    }

    getSmells(){
        return this.smells;
    }

    hasSmells():boolean{
        return this.smells.length > 0;
    }

    // TODO: to be reomoved beacuse a node has only the list of smells and not the principles
    addViolatedPrinciple(principle: Principle){
        this.violatedPrinciples.push(principle);
    }

    getViolatedPrinciples():Principle[]{
        return this.violatedPrinciples;
    }

    hasViolatedPrinciples():boolean{
        return this.violatedPrinciples.length > 0;
    }

  

    static fromJSON(data:string){
        var anode: ANode = new ANode(data['name'], data['id']);
        data['smells'].forEach((smell)=>{
            var s:Smell = new Smell(smell.name);
            smell['cause'].forEach((causa) =>{
                s.addCause(causa);
            });
            anode.addSmell(s);
        });
        return anode;
    }

}