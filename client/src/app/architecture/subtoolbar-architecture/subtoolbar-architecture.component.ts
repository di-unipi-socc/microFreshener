import { Component } from '@angular/core';
import { GraphService } from '../../graph/graph.service';
import { ToolSelectionService } from '../../editor/tool-selection/tool-selection.service';

@Component({
  selector: 'app-subtoolbar-architecture',
  templateUrl: './subtoolbar-architecture.component.html',
  styleUrls: ['./subtoolbar-architecture.component.css']
})
export class SubtoolbarArchitectureComponent {

  public readonly ADD_SERVICE = ToolSelectionService.SERVICE;
  //public readonly ADD_LINK = ToolSelectionService.LINK;
  public readonly ADD_DATASTORE = ToolSelectionService.DATASTORE;
  public readonly ADD_MESSAGE_ROUTER = ToolSelectionService.MESSAGE_ROUTER;
  public readonly ADD_MESSAGE_BROKER = ToolSelectionService.MESSAGE_BROKER;

  public toggledButtonsStatus;

  constructor(
    public gs: GraphService,
    public toolSelection: ToolSelectionService
  ) {
    this.toggledButtonsStatus = {};
    this.toggledButtonsStatus[this.ADD_SERVICE] = false;
    //this.toggledButtonsStatus[this.ADD_LINK] = false;
    this.toggledButtonsStatus[this.ADD_DATASTORE] = false;
    this.toggledButtonsStatus[this.ADD_MESSAGE_ROUTER] = false;
    this.toggledButtonsStatus[this.ADD_MESSAGE_BROKER] = false;
  }

  toggle(name: string) {
    this.toolSelection.enable(name, this.toggledButtonsStatus[name]);
    if(this.toggledButtonsStatus[name]) {
      this.unselectOthersThan(name);
    }
  }

  unselectOthersThan(newActive: string) {
    Object.keys(this.toggledButtonsStatus)
      // Get the other toggled(s)
      .filter((name) => name != newActive && this.toggledButtonsStatus[name])
      // Untoggle
      .forEach((untoggling) => {
        this.toggledButtonsStatus[untoggling] = false;
        this.toolSelection.enable(untoggling, false);
      });
  }

}
