import {Principle} from "./principles"
import * as joint from "jointjs";
import { Antipattern } from './antipattern';

/**
 * Analysed node. Contains the violated principles of the nodes
 */
export class ANode {

    violatedPrinciples: Principle[];
    name: string;
    id: string;

    constructor(name:string, id:string) {
        this.name = name;
        this.id = id;
        this.violatedPrinciples = []
    }

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
        // build the pvioalted principle form the JSOn receives fro the server
        data['principles'].forEach((principle)=>{
            var p:Principle = new Principle(principle.name);

            principle['antipatterns'].forEach((antipattern) =>{
                var a:Antipattern = new Antipattern(antipattern.name);
                a.cause = antipattern['cause'];
                p.addAntipattern(a);
            });
            anode.addViolatedPrinciple(p);
        });
        return anode;
    }

}