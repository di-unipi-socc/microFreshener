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
  }

  onSelectedAntipattern(principle){
    console.log("selected principles");
    this.showDialog();
    console.log("opende dialogs");

  }

  showDialog() {
    this.display = true;
 }
}
