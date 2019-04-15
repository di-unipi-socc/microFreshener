import { Smell } from './smell';
import { Causa } from './causa';
import { GraphService } from '../graph.service';

/**
 * Analysed node. Contains the violated principles of the nodes
 */
export class ANode {

    name: string;
    smells: Smell[];

    constructor(name:string) {
        this.name = name;
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

    static fromJSON(data:string){
        var anode: ANode = new ANode(data['name']);
        data['smells'].forEach((smell)=>{
            var s:Smell = new Smell(smell.name);
            smell['cause'].forEach((causa) =>{
                s.addCause(causa);
            });
            if(smell['refactorings']){
                smell['refactorings'].forEach((ref) =>{
                    s.addRefactoring(ref);
                });
            }
            anode.addSmell(s);
        });
        return anode;
    }

}