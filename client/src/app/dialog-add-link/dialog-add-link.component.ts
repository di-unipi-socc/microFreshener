import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import * as joint from 'jointjs';


@Component({
  selector: 'app-dialog-add-link',
  templateUrl: './dialog-add-link.component.html',
  styleUrls: ['./dialog-add-link.component.css']
})
export class DialogAddLinkComponent implements OnInit {

  source:joint.shapes.microtosca.Node;
  target:joint.shapes.microtosca.Node;

  circuit_breaker: boolean = false;
  dynamic_discovery: boolean = false;
  tiemout: boolean = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.source =  this.config.data.source;
    this.target = this.config.data.target;
  }

  save(){
    this.ref.close({"circuit_breaker":this.circuit_breaker, "dynamic_discovery": this.dynamic_discovery,"timeout":this.tiemout });
  }

}
