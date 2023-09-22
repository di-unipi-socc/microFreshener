import { Component } from '@angular/core';
import { GraphInvoker } from '../invoker/invoker';

@Component({
  selector: 'app-toolbar-items-architecture',
  templateUrl: './toolbar-items-architecture.component.html',
  styleUrls: ['./toolbar-items-architecture.component.css']
})
export class ToolbarItemsArchitectureComponent {

  toggled;

  constructor(public invoker: GraphInvoker) {
    this.toggled = {
      addNode: {
        status: false,
        action: () => { this.addNodeChanged() }
      },
      addLink: {
        status: false,
        action: () => { this.addLinkChanged() }
      }
    }
  }

  addNodeChanged() {
    console.log("AddNodeChanged");
    this.invoker.setAddNodeMode(this.toggled['addNode'].status);
    if(this.toggled['addNode'].status) {
      this.unselectOthersThan("addNode");
    }
  }

  addLinkChanged() {
    console.log("AddLinkChanged");
    //this.invoker.setAddLinkMode(active);
    if(this.toggled['addLink'].status) {
      this.unselectOthersThan("addLink");
    }
  }

  unselectOthersThan(newActive: string) {
    for(let button in this.toggled) {
      if(this.toggled[button].status && button != newActive) {
        this.toggled[button].status = false;
        this.toggled[button].action();
      }
    }
  }

}
