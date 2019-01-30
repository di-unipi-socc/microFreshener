import { RunTimeLink, DeploymentTimeLink } from './link';
import { json } from 'd3';

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

    run_time_links:RunTimeLink[];              // list of run time links 
    deployment_time_links:DeploymentTimeLink[]; // list of the deployemnt time links starting froma node
    
    constructor(id:number, name: string, type:string) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.x = 20;
        this.y = 20;
        this.vx = 10 + this.id;
        this.vy = 20;
        this.fx = 10 + this.id;
        this.fy = 20;
        this.run_time_links = [];
        this.deployment_time_links = [];
    }

    public static fromJSON(json:Object):Node{
        // name:"order",
        // type: "service"
        // "deployment_time_links":[
        //     {target: "shipping", type: "deploymenttime"}
        //     {target: "orderdb", type: "deploymenttime"}

        //  ]
        // run_time_links:[
        //     {target: "shipping", type: "runtime"}
        //     {target: "orderdb", type: "runtime"}
        //     {target: "rabbitmq", type: "runtime"}
        //     ]
        let el:Node = null;
        let name = json['name'];
        if(json['type'] == "service")
             el = new Service(5, name);
        if(json['type'] == "database")
             el = new Database(5, name);
        if(json['type'] == "communicationpattern")
             el = new CommunicationPattern(5, name);
        return el;
    }


    getRunTimeLinks(){
        return this.run_time_links;
    }

    getDeploymentLinks(){
        return this.deployment_time_links;
    }

    addRunTimeLink(target:Node){
        // f not isinstance(item, RunTimeInteraction):
        //     item = RunTimeInteraction(self, item)
        // self._run_time.append(item)
        // if not isinstance(item.target, str):
        //     item.target.up_run_time_requirements.append(item)
        var link = new RunTimeLink(this, target);
        this.run_time_links.push(link);
    }
    
    addDeploymentTimeLink(target:Node){
        // f not isinstance(item, RunTimeInteraction):
        //     item = RunTimeInteraction(self, item)
        // self._run_time.append(item)
        // if not isinstance(item.target, str):
        //     item.target.up_run_time_requirements.append(item)
        var link = new DeploymentTimeLink(this, target);
        this.deployment_time_links.push(link);
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