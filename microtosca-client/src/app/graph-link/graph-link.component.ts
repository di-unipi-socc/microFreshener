import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../d3';

@Component({
  selector: '[linkVisual]',
  templateUrl: './graph-link.component.html',
  styleUrls: ['./graph-link.component.css']
})
export class GraphLinkComponent implements OnInit {

  @Input('linkVisual') link: Link;
  constructor() { }

  ngOnInit() { }

  getDAttributeRuntime() {
    console.log("link upadtaed postion");
    let c = this.link.source.countOutgoingLinks();
    let raggio = 10;
    
    let dx = this.link.target['x'] - this.link.source['x'],
        dy = this.link.target['y'] - this.link.source['y'],
    dr = Math.sqrt(dx * dx + dy * dy);
    
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    return "M" + 
        this.link.source['x'] + "," + 
        this.link.source['y'] + "A" + 
        dr + "," + dr + " 0 0,1 " + 
        this.link.target['x'] + "," + 
        this.link.target['y'];
 }

 getDAttributeDeployement() {
  console.log("link deplyemnt postion");
  let c = this.link.source.countOutgoingLinks();
  let raggio = 10;
  
  let dx = this.link.target['x'] - this.link.source['x'],
      dy = this.link.target['y'] - this.link.source['y'],
  dr = Math.sqrt(dx * dx + dy * dy);
  
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  return "M" + 
      this.link.source['x'] + "," + 
      this.link.source['y'] + "A" + 
      dr + "," + dr + " 0 0,0 " + 
      this.link.target['x'] + "," + 
      this.link.target['y'];
}



}
