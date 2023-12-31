import { Component } from '@angular/core';
import { g } from 'jointjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-add-compute',
  templateUrl: './dialog-add-compute.component.html',
  styleUrls: ['./dialog-add-compute.component.css']
})
export class DialogAddComputeComponent {


  name: string;
  position: g.Point;

  constructor(private ref: DynamicDialogRef) { }

  ngOnInit() {
    this.name = null;
  }

  isDisableSave() {
    return this.name == null || this.name == "";
  }

  save() {
    this.ref.close({
      name: this.name
    });
  }


}
