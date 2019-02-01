import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import  {GraphService} from "../graph.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  principles:string[] = [];
  selectedPrinciples: string[] = [];

  constructor( private gs: GraphService) {
    // TODO: get the princniples with a dedicated services from the server
    this.principles.push("Decentralized Data Management");
    this.principles.push("Team-based Bounded Context");
    this.principles.push("Independent Deployability");
    this.principles.push("Horizzontal Scalability");
    this.principles.push("Fault Tolerance");
    this.selectedPrinciples = this.principles;

  } 

  ngOnInit() {  }

  analyse(){
    this.gs.getAnalysis()
    .subscribe((data) => {
     data['nodes'].forEach(element => {
        console.log(element.name);
        this.gs.graph.getNodeByName(element.name).principles = element.principles;
     });
    });
  }

}
