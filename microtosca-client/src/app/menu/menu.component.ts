import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import  {GraphService} from "../graph.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 

  constructor( private gs: GraphService) {
  } 

  ngOnInit() {
    //this.palette.div = this.paletteRef.nativeElement;
    //console.log("initialized menu bar");
  }

  analyse(){
    this.gs.getAnalysis()
    .subscribe((data) => {
    // console.log(data);
     data['nodes'].forEach(element => {
        console.log(element.name);
        this.gs.graph.getNodeByName(element.name).antipatterns = element.antipatterns;
     });
      //  this.gs.graph.getNodeByName()
     

    });

    console.log("anana");
  }

}
