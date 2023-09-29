import { Component } from '@angular/core';
import { GraphService } from '../../graph/graph.service';
import { EditorPermissionsService } from '../graph-editor/editor-permissions.service';

@Component({
  selector: 'app-subtoolbar-architecture',
  templateUrl: './subtoolbar-architecture.component.html',
  styleUrls: ['./subtoolbar-architecture.component.css']
})
export class SubtoolbarArchitectureComponent {

  toggled;

  constructor(public gs: GraphService, private permissions: EditorPermissionsService) {
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
    this.permissions.enableAddNode(this.toggled['addNode'].status);
    if(this.toggled['addNode'].status) {
      this.unselectOthersThan("addNode");
    }
  }

  addLinkChanged() {
    console.log("AddLinkChanged");
    this.permissions.enableAddLink(this.toggled['addLink'].status);
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
