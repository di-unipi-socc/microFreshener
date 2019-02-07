import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../d3';
import {Service} from '../d3';

@Component({
  selector: '[linkVisual]',
  templateUrl: './graph-link.component.html',
  styleUrls: ['./graph-link.component.css']
})
export class GraphLinkComponent implements OnInit {

  @Input('linkVisual') link: Link;



  constructor() {}

  ngOnInit() { }


    getDAttributeRuntime() {
        return this._build_d_attribute(1);
    }

    getDAttributeDeployement() {
    return this._build_d_attribute(0);
    }

    // build the d attribute fo drawing a curved lines
    _build_d_attribute(arc_flag:number ){
        let c = this.link.source.countOutgoingLinks();
        let dx = this.link.target['x'] - this.link.source['x'],
            dy = this.link.target['y'] - this.link.source['y'],
        dr = Math.sqrt(dx * dx + dy * dy);
        
        let normX = dx / dr;
        const normY = dy / dr;
        let  sourcePadding = 5
        if(this.link.source.constructor == Service){
            sourcePadding = 20;
        }
        let targetPadding = 5;// d.right ? 17 : 12;
        if(this.link.target.constructor == Service){
            targetPadding = 20; //(this.link.source['raggio']/2); //d.left ? 17 : 12;
        }
        const sourceX = this.link.source['x'] + (sourcePadding * normX);
        const sourceY = this.link.source['y'] + (sourcePadding * normY);
        const targetX = this.link.target['x'] - (targetPadding * normX);
        const targetY = this.link.target['y'] - (targetPadding * normY);

        return `M${sourceX},${sourceY}A ${dr},${dr} 0  0,${arc_flag} ${targetX},${targetY}`;
    }



}
