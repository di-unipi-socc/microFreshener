import { Component, OnInit } from '@angular/core';
import { GraphService } from "../graph.service";
import { DialogService } from 'primeng/api';
import { AddLinkComponent } from '../add-link/add-link.component';
import { AddNodeComponent } from '../add-node/add-node.component';
import { RemoveNodeComponent } from '../remove-node/remove-node.component';
import { RemoveLinkComponent } from '../remove-link/remove-link.component';
import { MessageService } from 'primeng/api';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
  providers: [DialogService]
})
export class MenuEditComponent implements OnInit {

  name: string; // name of the app

  items: MenuItem[];
  examples: MenuItem[];

  constructor(private gs: GraphService, public dialogService: DialogService, private messageService: MessageService) { }

  ngOnInit() {
    this.name = this.gs.getGraph().getName();
    this.items = [
      // "TB" (top-to-bottom) / "BT" (bottom-to-top) / "LR" (left-to-right) / "RL" (right-to-left))
      {label: 'Botton-to-top', command: () => {
        this.gs.getGraph().applyLayout("BT");
      }},
      {label: 'Top-to-bottom', command: () => {
        this.gs.getGraph().applyLayout("TB");
      }},
      {label: 'Left-to-right', command: () => {
        this.gs.getGraph().applyLayout("LR");
      }},
      {label: 'Right-to-left', command: () => {
        this.gs.getGraph().applyLayout("RL");
      }},
  ];
  this.examples = [
    {label: 'Hello world', command: () => {
      this.downloadExample("helloworld");
    }},
    {label: 'Extra', command: () => {
      this.downloadExample("extra");
    }},
    {label: 'Sockshop', command: () => {
      this.downloadExample("sockshop");
    }},
];
  }

  saveName() {
   this.gs.getGraph().setName(this.name);
   this.messageService.add({ severity: 'success', summary: 'App renamed correctly', detail: "New name " + this.name });
  }

  downloadExample(name:string){
    this.gs.downloadExample(name)
    .subscribe((data) => {
      console.log(data);
      this.gs.getGraph().builtFromJSON(data);
      this.gs.getGraph().applyLayout("LR");
      this.messageService.add({severity:'success', summary:'Graph dowloaded correclty', detail:''});
    });
  }

  addService() {
    console.log("Adding service node");
    const ref = this.dialogService.open(AddNodeComponent, {
      header: 'Add a Service node',
      width: '40%'
    });
    ref.onClose.subscribe((data) => {
      if (data.name) {
        this.gs.getGraph().addService(data.name);
        this.messageService.add({ severity: 'success', summary: "Service " + data.name + " added correctly", detail: data.name });
      } else
        this.messageService.add({ severity: 'error', summary: "No name inserted", });
    });
  }

  addCommunicationPattern() {
    console.log("Adding communication pattern node");
    const ref = this.dialogService.open(AddNodeComponent, {
      header: 'Add a Communication Pattern node',
      width: '40%',
      data: {
        showType: true
      },
    });
    ref.onClose.subscribe((data) => {
      if (data.name && data.type) {
        this.gs.getGraph().addCommunicationPattern(data.name, data.type.name);
        this.messageService.add({ severity: 'success', summary: `CommunicationPattern ${data.name} ${data.type.name}  added correctly`, detail: data.name });
      } else
        this.messageService.add({ severity: 'error', summary: "No name or type inserted", });
    });

  }

  addDatabase() {
    console.log("Adding database node");
    const ref = this.dialogService.open(AddNodeComponent, {
      header: 'Add a Database node',
      width: '40%'
    });
    ref.onClose.subscribe((data) => {
      if (data.name) {
        this.gs.getGraph().addDatabase(data.name);
        this.messageService.add({ severity: 'success', summary: "Databse " + data.name + " added correctly", detail: data.name });
      } else
        this.messageService.add({ severity: 'error', summary: "No name  inserted", });
    });

  }

  removeServices(){
    const ref = this.dialogService.open(RemoveNodeComponent, {
      data: {
        nodes: this.gs.getGraph().getServices()
      },
      header: "Remove a Service node",
      width: '40%'
    });

    ref.onClose.subscribe((nodes) => {
      if (nodes) {
        console.log(nodes);
        nodes.forEach(node => {
          this.gs.getGraph().removeNode(node.id);
          this.messageService.add({ severity: 'success', summary: 'Node removed correctly', detail: node.name });
        });
      } else
      this.messageService.add({ severity: 'error', summary: 'No nodes selected'});
    });
  }

  removeCommunicationPatterns(){
    const ref = this.dialogService.open(RemoveNodeComponent, {
      data: {
        nodes: this.gs.getGraph().getCommunicationPattern()
      },
      header: "Remove a Communication pattern node",
      width: '40%'
    });

    ref.onClose.subscribe((nodes) => {
      if (nodes) {
        console.log(nodes);
        nodes.forEach(node => {
          this.gs.getGraph().removeNode(node.id);
          this.messageService.add({ severity: 'success', summary: 'Node removed correctly', detail: node.name });
        });
      } else
      this.messageService.add({ severity: 'error', summary: 'No nodes selected'});
    });
  }

  removeDatabases(){
    const ref = this.dialogService.open(RemoveNodeComponent, {
      data: {
        nodes: this.gs.getGraph().getDatabase()
      },
      header: "Remove a database node",
      width: '40%'
    });

    ref.onClose.subscribe((nodes) => {
      if (nodes) {
        console.log(nodes);
        nodes.forEach(node => {
          this.gs.getGraph().removeNode(node.id);
          this.messageService.add({ severity: 'success', summary: 'Node removed correctly', detail: node.name });
        });
      } else
      this.messageService.add({ severity: 'error', summary: 'No nodes selected'});
    });
  }

  addDeploymentTimeInteraction(){
    console.log("Cliccked deployment time");
    const ref = this.dialogService.open(AddLinkComponent, {
      header: 'Add Deployment Time interaction',
      width: '50%'
    });
    ref.onClose.subscribe((nodes) => {
    //TODO: show in a message the selected nodes
    if (nodes.source && nodes.target) {
      this.gs.getGraph().addDeploymentTimeInteraction(nodes.source, nodes.target);
      this.messageService.add({severity:'success', summary:'Deployment time interaction added succesfully'});
    }
    else
      this.messageService.add({severity:'error', summary:'At least two nodes must be selected'});

   });
  }
  
  addRunTimeInteraction(){
    console.log("Cliccked runtime time");
    const ref = this.dialogService.open(AddLinkComponent, {
      header: 'Add Run Time interaction',
      width: '50%'
    });
    ref.onClose.subscribe((nodes) => {
    //TODO: show in a message the selected nodes
    if (nodes.source && nodes.target) {
      this.gs.getGraph().addRunTimeInteraction(nodes.source, nodes.target);
      this.messageService.add({severity:'success', summary:'Run time interaction added succesfully'});
    }
    else
      this.messageService.add({severity:'error', summary:'At least two nodes must be selected'});
   });

  }

}
