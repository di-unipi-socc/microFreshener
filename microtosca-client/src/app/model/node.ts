// import { RunTimeLink, DeploymentTimeLink } from './link';

// import { Principle } from '../analysis/principles';

// Implementing SimulationNodeDatum interface into our custom Node class
export interface Node {

    getID():string;


}

// // Implementing SimulationNodeDatum interface into our custom Node class
// export class Database extends Node {
//     constructor(id: number, name:string) { 
//             super(id, name, "database"); 
//     }
// }

// export class Service extends Node {
//     raggio: number; 
//     constructor(id: number, name:string) { 
//         super(id, name, "service"); 
//         this.raggio = 20;
//     }
// }

// export class CommunicationPattern extends Node {
//     constructor(id: number, name:string) { 
//         super(id,name, "communicationpattern"); 
//     }
// }