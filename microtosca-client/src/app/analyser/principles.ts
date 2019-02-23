import { Antipattern } from "./antipattern";

export class Principle {

    name: string;
    antipatterns: Antipattern[];

    constructor(name: string) {
        this.name = name;
        this.antipatterns = []
    }

    addAntipattern(antipattern:Antipattern){
        this.antipatterns.push(antipattern);
    }

    getAntipatterns():Antipattern[]{
        return this.antipatterns;
    }

}