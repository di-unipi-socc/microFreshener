import { Component, ViewChild, ElementRef } from '@angular/core';
import { D3Service} from './d3';
import {ForceDirectedGraph} from './d3'
import  {GraphService} from "./graph.service";


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
    // this.gs.exportGraph();

    this.gs.uploadGraph()
      .subscribe(data => {
        console.log(data);
      });

  }

  download(){
    this.gs.downloadGraph()
    .subscribe((data: ForceDirectedGraph) => 
      console.log(data)
    );

  }
}
