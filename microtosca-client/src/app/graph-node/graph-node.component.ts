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
    console.log(this.node.principles);
  }

  onSelectedAntipattern(principle){
    console.log("selected principles");
  }

  showDialog() {
    this.display = true;
 }
}
