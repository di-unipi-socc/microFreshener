
// Implementing SimulationNodeDatum interface into our custom Node class
export class Node implements d3.SimulationNodeDatum {
    index?: number;
    
    public x?: number;
    public y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    
    id: number;
    public name: string; // name of the node
    linkCount: number = 0;
    type: string;  // types of the node: service, database, communication pattern
    
    constructor(id:number, name: string, type:string) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.x = 20;
        this.y = 20;
    }
}

// Implementing SimulationNodeDatum interface into our custom Node class
export class Database extends Node {
    constructor(id: number, name:string) { 
            super(id, name, "database"); 
    }
}

export class Service extends Node {
    constructor(id: number, name:string) { 
        super(id, name, "service"); 
    }
}

export class CommunicationPattern extends Node {
    constructor(id: number, name:string) { 
        super(id,name, "communicationpattern"); 
    }
}