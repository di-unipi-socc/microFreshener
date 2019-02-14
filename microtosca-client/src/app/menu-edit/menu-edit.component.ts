import { Component, OnInit } from '@angular/core';
import { Node, Link, Database, Service,ForceDirectedGraph, D3Service, CommunicationPattern, DeploymentTimeLink, RunTimeLink} from '../d3';
import { GraphService } from "../graph.service";
import { DialogService } from 'primeng/api';
import { AddLinkComponent } from '../add-link/add-link.component';
import { AddNodeComponent } from '../add-node/add-node.component';
import { RemoveNodeComponent } from '../remove-node/remove-node.component';
import { RemoveLinkComponent } from '../remove-link/remove-link.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
  providers: [DialogService]
})
export class MenuEditComponent implements OnInit {
  
  service: Node;
  database: Node;
  communicationPattern: Node;
  deploymenttimelink: Link;
  runtimelink: Link;
  
  name:string; // name of the app

  constructor(private gs: GraphService, public dialogService: DialogService, private messageService: MessageService) {   }

  ngOnInit() {
     this.service = new Service(0,'');
     this.database = new Database(0,'');
     this.communicationPattern = new CommunicationPattern(0,'');
     this.deploymenttimelink = new DeploymentTimeLink(null, null);
     this.runtimelink = new RunTimeLink(null, null);

    this.name = this.gs.graph.name;
  }

  saveName(){
    this.gs.graph.name = this.name;
    this.messageService.add({severity:'success', summary:'App renamed correctly', detail: "New name "+ this.name});
  }

  removeNode(node:Node){
    var nodes:Node[] = null;
    var header:string = "";

    switch(node.constructor) { 
      case Database: { 
        console.log("Cliccked database");
        nodes = this.gs.getDatabase()
        header = 'Remove Databases';
        break; 
      } 
      case Service: { 
        console.log("Cliccked service");
        nodes = this.gs.getServices();
        header =  'Remove Services';
         break; 
      } 
      case CommunicationPattern: {
        console.log("Remove communicatio patterns");
        nodes = this.gs.getCommunicationPattern()
        header = 'Remove Communication Patterns';
        break; 
      }
      default : { 
        console.log("Node non riconosciuto");
         break; 
      } 
    }

    const ref = this.dialogService.open(RemoveNodeComponent, {
      data: {
          nodes: nodes
      },
      header: header,
      width: '90%'
    });
  
    ref.onClose.subscribe((nodes) => {
      if (nodes) {
        console.log(nodes);
        nodes.forEach(node => {
          this.gs.removeNode(node);
          this.messageService.add({severity:'success', summary:'Node removed correctly', detail: node.name});
        });
      }else
      console.log("no name inserted");
    });
    
  }

  onClickNode(node:Node){
    switch(node.constructor) { 
      case Database: { 
        console.log("Cliccked database");
        const ref = this.dialogService.open(AddNodeComponent, {
          header: 'Add a Database',
          width: '90%'
        });
        ref.onClose.subscribe((name) => {
          //TODO: show in a message the selected nodes
          if (name) {
            // this.gs.addNode(new Database(2, name));
            this.gs.getGraphjoint().addDatabase(name);
            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
            this.messageService.add({severity:'success', summary: "Database " + name+" added correctly", detail: node.name});
          }else
          console.log("no name inserted");
        });
       
         break; 
      } 
      case Service: { 
        console.log("Cliccked service");
        const ref = this.dialogService.open(AddNodeComponent, {
          header: 'Add a Service',
          width: '90%'
        });
        ref.onClose.subscribe((name) => {
          //TODO: show in a message the selected nodes
          if (name) {
            this.gs.getGraphjoint().addService(name);
            // this.gs.addNode(new Service(2 ,name));
            this.messageService.add({severity:'success', summary:"Service "+ name+ " added correctly", detail: node.name});

            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }else
            console.log("no name inserted");
        });
        
        break; 
      } 
      case CommunicationPattern: {
        console.log("Cliccked communicationpattern");
        const ref = this.dialogService.open(AddNodeComponent, {
          header: 'Add a Communication pattern',
          width: '90%'
        });
        ref.onClose.subscribe((name) => {
          //TODO: show in a message the selected nodes
          if (name) {
            this.gs.getGraphjoint().addCommunicationPattern(name,"mb");
            // this.gs.addNode(new CommunicationPattern(2, name));
            this.messageService.add({severity:'success', summary:"Communication pattern " + name+" added  correctly", detail: node.name});

            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }else
          console.log("no name inserted");
        });
        
    
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
        const ref = this.dialogService.open(AddLinkComponent, {
            header: 'Add Run-time interaction',
            width: '90%'
        });

        ref.onClose.subscribe((nodes) => {
          //TODO: show in a message the selected nodes
          if (nodes.source && nodes.target) {
            this.gs.addRunTimeLink(nodes.source, nodes.target);
            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }
          else
          console.log("You must delect at lest two nodes")
        });
        break; 
      }
      case DeploymentTimeLink: { 
        const ref = this.dialogService.open(AddLinkComponent, {
          header: 'Add Deployment-time interaction',
          width: '90%'
        });

        ref.onClose.subscribe((nides) => {
          //TODO: show in a message the selected nidess
          if (nides.source && nides.target) {
            this.gs.addDeploymenttimeLink(nides.source, nides.target);
            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }
      });
         break; 
      } 
      default : { 
        console.log("LINK non riconosciuto");
         break; 
      } 
   } 
  }

  removeLink(link:Link){
    switch(link.constructor) { 
      case RunTimeLink: { 

        const ref = this.dialogService.open(RemoveLinkComponent, {
            data: {
              links: this.gs.getRunTimeLinks()
          },
            header: 'Remove Run-time interaction',
            width: '90%'
        });

        ref.onClose.subscribe((links) => {
          //TODO: show in a message the selected nodes
          if (links) {
            links.forEach((link)=>{
              console.log("removed runtime links"+ link.source.name + " " + link.target.name);
              this.gs.removeLink(link)}
            );
            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }
          else
          console.log("You must delect at lest two nodes")
        });
        break; 
      }
      case DeploymentTimeLink: { 
        const ref = this.dialogService.open(RemoveLinkComponent, {
          data: {
            links: this.gs.getDeploymentTimeLinks()
          },
          header: 'Remove Deployment-time interaction',
          width: '90%'
        });

        ref.onClose.subscribe((links) => {
          //TODO: show in a message the selected nidess
          if (links) {
            links.forEach((link)=>{
              console.log("removed deployment links"+ link.source.name + " " + link.target.name);
              this.gs.removeLink(link)}
            );
            // this.messageService.add({severity:'success', summary:'Service Message', detail:"MMM"});
          }
      });
         break; 
      } 
      default : { 
        console.log("LINK non riconosciuto");
         break; 
      } 
   } 
  }
}
