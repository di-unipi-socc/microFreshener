import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import  {GraphService} from "../graph.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  principles:Object[] = [];
  selectedPrinciples: Object[] = [];

  constructor( private gs: GraphService) {
    //TODO: get the princniples with a service from the server
    this.principles.push({"name":"Decentralized Data Management", "value":"decentralizedData"});
    this.principles.push({"name":"Bounded context", "value":"boundedContext"});
    this.principles.push({"name":"Independent deployment", "value":"independentlyDeployable"});
    this.principles.push({"name":"Horizzontal scalability", "value":"horizzontallyScalable"});
    this.principles.push({"name":"Fault resilience", "value":"faultResilience"});

    this.selectedPrinciples = this.principles;
  } 

  ngOnInit() {  }

  analyse(){
    console.log("selected principles:")
    let t:string[] = this.selectedPrinciples.map(principle => {return principle['value']});
    console.log(t),

    this.gs.getAnalysis(t)
      .subscribe((data) => {
     data['nodes'].forEach(element => {
        console.log(element.name);
        this.gs.graph.getNodeByName(element.name).principles = element.principles;
     });
    });
  }

}
