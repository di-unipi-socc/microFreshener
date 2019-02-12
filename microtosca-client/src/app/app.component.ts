import { Component, ViewChild, ElementRef } from '@angular/core';
import { D3Service} from './d3';
import {ForceDirectedGraph} from './d3'
import  {GraphService} from "./graph.service";
import { Node, RunTimeLink,Link, Service, Database, DeploymentTimeLink, CommunicationPattern} from "./d3";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ciao microtosca-client';

  display;

  constructor(private gs: GraphService) {  }

  upload(){
    this.gs.uploadGraph()
      .subscribe(data => {
        this.closeSidebar();
        console.log(data);
        alert("Saved correctly");
      });
  }

  onUpload(event) {
    console.log("upload handler");
    this.download();
    console.log("updated graph locally");
  }

  download(){
    this.gs.downloadGraph()
    .subscribe((data) => {
      this.closeSidebar();
      console.log(data);
      this.gs.graph = ForceDirectedGraph.fromJSON(data);
    });
  }
  
  closeSidebar(){
     this.display = false;
  }
}
