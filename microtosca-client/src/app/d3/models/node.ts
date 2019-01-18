
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
    linkCount: number = 0;
    type: string;  // types of the node: service, database, communication pattern
    
    constructor(id:number, type:string) {
        this.id = id;
        this.type = type;
        this.x = 20;
        this.y = 20;
    }
}

// Implementing SimulationNodeDatum interface into our custom Node class
export class Database extends Node {
    constructor(id: number) { 
            super(id, "database"); 
    }
}

export class Service extends Node {
    constructor(id: number) { 
        super(id, "service"); 
    }
}

export class CommunicationPattern extends Node {
    constructor(id: number) { 
        super(id, "communicationpattern"); 
    }
}