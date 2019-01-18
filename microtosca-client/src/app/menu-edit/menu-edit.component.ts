import { Component, OnInit } from '@angular/core';
import { Node, Link, Database, Service,ForceDirectedGraph, D3Service, CommunicationPattern, DeploymentTimeLink, RunTimeLink} from '../d3';
import {GraphService} from "../graph.service";

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {
  service: Node;
  database: Node;
  communicationPattern: Node;
  deploymenttimelink: Link;
  runtimelink: Link;


  _options = {width: 200, height:200};

  graph:ForceDirectedGraph = null;
  
  constructor(private gs: GraphService) { 

  }

  ngOnInit() {
     this.service = new Service(0);
     this.database = new Database(0);
     this.communicationPattern = new CommunicationPattern(0);

     this.deploymenttimelink = new DeploymentTimeLink(null, null);
     this.runtimelink = new RunTimeLink(null, null);

  }

  onClickNode(node:Node){
    switch(node.constructor) { 
      case Database: { 
        console.log("Cliccked database");
         this.gs.addNode(new Database(2));
         break; 
      } 
      case Service: { 
        console.log("Cliccked service");
        this.gs.addNode(new Service(2));
         break; 
      } 
      case CommunicationPattern: {
        console.log("Cliccked communicationpattern");
        this.gs.addNode(new CommunicationPattern(2));

        break; 
      }
      default : { 
        console.log("Node non riconosciuto");
         break; 
      } 
    }
   } 

   onClickLink(link:Link){
    switch(link.constructor) { 
      case RunTimeLink: { 
        console.log("Cliccked runtime");
         this.gs.addLink(new RunTimeLink(null,null));
         break; 
      } 
      case DeploymentTimeLink: { 
        console.log("Cliccked deployemnt time");
        this.gs.addLink(new DeploymentTimeLink(null, null));
         break; 
      } 
      default : { 
        console.log("LINK non riconosciuto");
         break; 
      } 
   } 
  }



}
