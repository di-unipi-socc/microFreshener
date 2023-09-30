import { Component } from '@angular/core';
import { GraphService } from '../../graph/graph.service';
import { EditorPermissionsService } from '../permissions/editor-permissions.service';

@Component({
  selector: 'app-subtoolbar-architecture',
  templateUrl: './subtoolbar-architecture.component.html',
  styleUrls: ['./subtoolbar-architecture.component.css']
})
export class SubtoolbarArchitectureComponent {

  public toggledButtonsStatus;
  public readonly ADD_NODE = "addNode";
  public readonly ADD_LINK = "addLink";
  public readonly ADD_DATASTORE = "addDatastore";
  public readonly ADD_MESSAGE_ROUTER = "addMessageRouter";
  public readonly ADD_MESSAGE_BROKER = "addMessageBroker";

  constructor(public gs: GraphService, private permissions: EditorPermissionsService) {
    this.toggledButtonsStatus = {};
    this.toggledButtonsStatus[this.ADD_NODE] = false;
    this.toggledButtonsStatus[this.ADD_LINK] = false;
    this.toggledButtonsStatus[this.ADD_DATASTORE] = false;
    this.toggledButtonsStatus[this.ADD_MESSAGE_ROUTER] = false;
    this.toggledButtonsStatus[this.ADD_MESSAGE_BROKER] = false;
  }

  toggle(name: string) {
    this.updateAfterToggling(name);
    if(this.toggledButtonsStatus[name]) {
      this.unselectOthersThan(name);
    }
  }

  updateAfterToggling(name: string) {
    let permissionName = this.getPermissionName(name);
    console.log("updating permissions for", permissionName, this.toggledButtonsStatus[name]);
    this.permissions.enable(permissionName, this.toggledButtonsStatus[name]);
  }

  unselectOthersThan(newActive: string) {
    Object.keys(this.toggledButtonsStatus)
      // Get the other toggled(s)
      .filter((name) => name != newActive && this.toggledButtonsStatus[name])
      // Untoggle
      .forEach((untoggling) => {
        if(this.toggledButtonsStatus[untoggling] && untoggling != newActive) {
          this.toggledButtonsStatus[untoggling] = false;

          // Update permissions if they're not both a node type (else keep it allowed)
          if(!(this.getPermissionName(newActive) == "addNode") || !(this.getPermissionName(untoggling) == "addNode")) {
            this.updateAfterToggling(untoggling);
          }
        }
      });
  }

  getPermissionName(name) {
    if(name == this.ADD_NODE || name == this.ADD_DATASTORE || name == this.ADD_MESSAGE_ROUTER || name == this.ADD_MESSAGE_BROKER)
      return "addNode";
    else
      return name;
  }

}
