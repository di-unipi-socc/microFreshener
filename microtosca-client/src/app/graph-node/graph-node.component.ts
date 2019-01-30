import { Component, OnInit, Input} from '@angular/core';
import { Node } from '../d3';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './graph-node.component.html',
  styleUrls: ['./graph-node.component.css']
})
export class GraphNodeComponent implements OnInit {

  @Input('nodeVisual') node: Node;
  display: boolean = false;



  constructor() { }

  ngOnInit() {
    console.log(this.node.antipatterns);
  }

  onSelectedAntipattern(ant){
    console.log("selected antipattern");
  }

  showDialog() {
    this.display = true;
}
}
