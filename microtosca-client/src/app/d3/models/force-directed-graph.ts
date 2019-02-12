
import { EventEmitter } from '@angular/core';
import { Link, DeploymentTimeLink, RunTimeLink} from './link';
import { Node } from './node';


import * as d3 from 'd3';

const FORCES = {
    LINKS: 1 / 50,
    COLLISION: 1,
    CHARGE: -1
}

export class ForceDirectedGraph {
    public ticker: EventEmitter<d3.Simulation<Node, Link>> = new EventEmitter();
    public simulation: d3.Simulation<any, any>;

    _options: Object;

    public nodes: Node[] = [];
    
    // TODO: delete the links array. each node has its own list of links
    public links: Link[] = [];

    public name = "init name";

    constructor(nodes, links, options: { width, height }) {
        this.nodes = nodes;
        this.links = links;
        this._options = options; // added dido
        // this.initSimulation(options);
    }

    public getNodes():Node[]{
      return this.nodes;
    }

    public getDeploymentTimeLinks():DeploymentTimeLink[]{
      var deplLinks:DeploymentTimeLink[] = []
      this.nodes.forEach((node)=>{
        node.getDeploymentLinks().forEach((link)=>deplLinks.push(link));

      })
      console.log(deplLinks);
      return deplLinks;
    }

    public getRunTimeLinks():RunTimeLink[]{
      var runLinks:RunTimeLink[] = []
      this.nodes.forEach((node)=>{
        node.getRunTimeLinks().forEach((link)=>runLinks.push(link));

      })
      console.log(runLinks);
      return runLinks;
    }

    public static fromJSON(json:Object):ForceDirectedGraph{
      let graph = new ForceDirectedGraph([],[],{ width:600, height:500 } );
      let name  = json['name'];
      console.log(name)
      for (let n of json['nodes']){
            let node:Node = Node.fromJSON(n)
            graph.addNode(node);
      }
      graph.getNodes().forEach((node)=> console.log(node));
      return graph
    } 

    getNode(node:Node):Node{
      return this.nodes.find(x => x.name == node.name);
    }

    getNodeByName(name:string){
      return this.nodes.find(x => x.name == name);
    }

    public getLinks(){
      return this.links;
    }

    public removeNode(n:Node){
      // remove the upcoming links from other nodes
      n.up_deployment_time_requirements.forEach((link)=>{
        link.source.removeDeploymentTimeLink(link);
      });
      n.up_run_time_requirements.forEach((link)=>{
        link.source.removeRunTimeLink(link)
      })
      // remove the node
      this.nodes= this.nodes.filter(node => node.name !== n.name)
      console.log(this.nodes);
    }

    public removeLink(l:Link){
      var sourceNode:Node = l.source;
      if(l.constructor == RunTimeLink){
        sourceNode.removeRunTimeLink(l);
      }
      else{
        sourceNode.removeDeploymentTimeLink(l);
      }

    }

    public addNode(n:Node){
      this.nodes.push(n);
    }

    public addDeploymentTimeLink(source: Node, target: Node){
      source.addDeploymentTimeLink(target);
    }

    public addRunTimeLink(source: Node, target: Node){
        source.addRunTimeLink(target);
        // var l:DeploymentTimeLink = new RunTimeLink(source, target);
        // this.links.push(l);
    }
  

    connectNodes(source, target) {
        let link;
    
        if (!this.nodes[source] || !this.nodes[target]) {
          throw new Error('One of the nodes does not exist');
        }
    
        link = new RunTimeLink(source, target);
        this.simulation.stop();
        this.links.push(link);
        this.simulation.alphaTarget(0.3).restart();
    
        this.initLinks();
    }

    mySimulation(){
      // TODO: use widht and heigh passed as argument
      var width = 600, height = 500
      var nodes = [{}, {}, {}, {}, {}]
      
      this.simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', this.myTicked);

    }

    myTicked() {
      var nodes = [{}, {}, {}, {}, {}]
      console.log("My tick");

      var u = d3.select('svg')
        .selectAll('circle')
        .data(nodes);
      
      // u.enter()
      //   .append('circle')
      //   .attr('r', 5)
      //   .merge(u)
      //   .attr('cx', function(d) {
      //     return d.x
      //   })
      //   .attr('cy', function(d) {
      //     return d.y
      //   })
    
      // u.exit().remove()
    }
 
    initNodes() {
      if (!this.simulation) {
        throw new Error('simulation was not initialized yet');
      }
      console.log("inti node simulation on ");
      console.log(this.nodes);

      this.simulation.nodes(this.nodes);
    }
  
    initLinks() {
      if (!this.simulation) {
        throw new Error('simulation was not initialized yet');
      }
      console.log("inti links called");
  
      this.simulation.force('links',
        d3.forceLink(this.links)
          .id(d => d['id'])
          .strength(FORCES.LINKS)
      );
    }

    initSimulation(options) {
      if (!options || !options.width || !options.height) {
          throw new Error('missing options when initializing simulation');
      }

      console.log(options);
      /** Creating the simulation */
      if (!this.simulation) {
          const ticker = this.ticker;
  
          console.log("Creating force simulation");
          // Creating the force simulation and defining the charges
          this.simulation = d3.forceSimulation()
          .force("charge",
              d3.forceManyBody()
                  .strength(FORCES.CHARGE)
          );

          // Connecting the d3 ticker to an angular event emitter
          this.simulation.on('tick', function () {
              // console.log("tick fired");
              ticker.emit(this);
              
              // console.log("tick emitted");
          });

          this.initNodes();
          this.initLinks();
      }

      /** Updating the central force of the simulation */
      this.simulation.force("centers", d3.forceCenter(options.width / 2, options.height / 2));

      /** Restarting the simulation internal timer */
      this.simulation.restart();
  }
}