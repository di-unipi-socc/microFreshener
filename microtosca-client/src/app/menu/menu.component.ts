import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import  {GraphService} from "../graph.service";
import { RunTimeLink, DeploymentTimeLink } from '../d3';

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
    this.gs.getAnalysis(t)
      .subscribe((data) => {
        data['nodes'].forEach(element => {
            // console.log(element);
            this.gs.graph.getNodeByName(element.name).principles = element.principles;
     });
    });
  }

  onSelectedAntipattern(antipattern){
    console.log("antipattern selected");
    console.log(antipattern);
    // {name: "direct_Interaction", 
    //   cause :[ {
    //     source:"order (service)"
    //     target: "shipping (service)"
    //     type: "runtime"
    //     }]
    antipattern.cause.forEach(causa => {
      console.log(causa);
      let source  = this.gs.getNode(causa['source']);
      console.log(causa['target']);
      if(causa['type'] == "deploymenttime"){
        let link = source.getDeploymnetTimeLinkTo(causa['target']);
        link.setBadInteraction();
      }
      else{
        let link= source.getRunTimeLinkTo(causa['target']);
        link.setBadInteraction();
      }
    });

    }

}
