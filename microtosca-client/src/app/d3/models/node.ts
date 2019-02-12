import { RunTimeLink, DeploymentTimeLink } from './link';
import { json } from 'd3';
import { Principle } from '../analysis/principles';

// Implementing SimulationNodeDatum interface into our custom Node class
export class Node implements d3.SimulationNodeDatum{
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

    // reverse requirements
    up_deployment_time_requirements:RunTimeLink[];
    up_run_time_requirements:DeploymentTimeLink[];

    // TODO: implementare la classe  principles 
    principles:any; // list of principles associated with a node. each principles has associated one or antipatterns violated
    
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
        // reverse links
        this.up_deployment_time_requirements = []
        this.up_run_time_requirements = []

        // list of violated principles
        this.principles = [];
    }

    //TODO: principle class with associated a list of antipatterns and refactorings.
    assignViolatedPrinciple(principle:Principle){
        this.principles.push(principle);
    }

    // return the principles violated in  a node
    getViolatedPrinciples():any[]{
        // filter the principles that has at least one antipatterns 
        // let antipatterns = this.principles.map(principle => { 
        //     //  typeof principle.antipatterns  !== 'undefined' && 
        //      principle.antipatterns.filter( antipattern => {
        //         antipattern.cause.length > 0;
        //      })
        // });
        principlesForTreeModel:
        return this.principles;
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

    countOutgoingLinks(){
        return this.run_time_links.length + this.deployment_time_links.length;
    }

    getRunTimeLinkTo(target):RunTimeLink{
        return this.run_time_links.find(link => link.target.name == target);
    }

    getDeploymnetTimeLinkTo(target):DeploymentTimeLink{
        return this.deployment_time_links.find(link => link.target.name == target);
    }

    getOutgoingLinks(){
        return this.run_time_links.concat(this.deployment_time_links);
    }

    removeRunTimeLink(l:RunTimeLink){
        this.run_time_links= this.run_time_links.filter(link => link.target.name !== l.target.name)
        // remove uplink form the target node
        this._removeUpDeploymentTimeLink(l);
    }

    _removeUpRunTimeLink(l:RunTimeLink){
        this.up_run_time_requirements= this.up_run_time_requirements.filter(link => link.source.name !== l.source.name)
    }

    removeDeploymentTimeLink(l:DeploymentTimeLink){
        this.deployment_time_links= this.deployment_time_links.filter(link => link.target.name !== l.target.name)
        this._removeUpDeploymentTimeLink(l);
    }

    _removeUpDeploymentTimeLink(l:RunTimeLink){
        this.up_deployment_time_requirements= this.up_deployment_time_requirements.filter(link => link.source.name !== l.source.name)
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
        target.up_run_time_requirements.push(link);
    }
    
    addDeploymentTimeLink(target:Node){
        // f not isinstance(item, RunTimeInteraction):
        //     item = RunTimeInteraction(self, item)
        // self._run_time.append(item)
        // if not isinstance(item.target, str):
        //     item.target.up_run_time_requirements.append(item)
        var link = new DeploymentTimeLink(this, target);
        this.deployment_time_links.push(link);
        target.up_deployment_time_requirements.push(link);
    }
}

// Implementing SimulationNodeDatum interface into our custom Node class
export class Database extends Node {
    constructor(id: number, name:string) { 
            super(id, name, "database"); 
    }
}

export class Service extends Node {
    raggio: number; 
    constructor(id: number, name:string) { 
        super(id, name, "service"); 
        this.raggio = 20;
    }
}

export class CommunicationPattern extends Node {
    constructor(id: number, name:string) { 
        super(id,name, "communicationpattern"); 
    }
}