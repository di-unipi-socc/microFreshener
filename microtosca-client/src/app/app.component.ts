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

  constructor(private gs: GraphService) {

  }

  upload(){
    this.gs.uploadGraph()
      .subscribe(data => {
        console.log(data);
        alert("Uploaded correctly");
      });

  }

  download(){
    this.gs.downloadGraph()
    .subscribe((data) => {
      console.log(data);
      this.gs.graph = ForceDirectedGraph.fromJSON(data);
      //  data.fromJson(data);
      // let g = {"nodes":[{"linkCount":0,"id":1,"type":"service","name":"shipping","run_time_links":
      // [{"target":"orderdb","type":"runtime"},{"target":"rabbitmq","type":"runtime"}],
      // "deployment_time_links":[{"target":"orderdb","type":"deploymenttime"}],
      // "index":0,"x":298.89970802992144,"y":248.39687870002697,"vy":0,"vx":0},
      // {"linkCount":0,"id":1,"type":"service","name":"order","run_time_links":[
      //   {"target":"shipping","type":"runtime"},{"target":"orderdb","type":"runtime"},
      //   {"target":"rabbitmq","type":"runtime"}],"deployment_time_links":[
      //     {"target":"shipping","type":"deploymenttime"},
      //     {"target":"orderdb","type":"deploymenttime"}],
      //     "index":1,"x":291.52601924913824,"y":255.15178164264222,"vy":0,"vx":0},{"linkCount":0,"id":1,"type":"communicationpattern","name":"rabbitmq","run_time_links":[],"deployment_time_links":[],"index":2,"x":300.13609448587164,"y":234.30889273568334,"vy":0,"vx":0},{"linkCount":0,"id":1,"type":"database","name":"orderdb","run_time_links":[],"deployment_time_links":[],"index":3,"x":309.43817823506873,"y":262.1424469216475,"vy":0,"vx":0}],"links":[]};
      // transofmr from hson data to DirectedGraph
      //  console.log(JSON.parse(data));
    });

  }
}
