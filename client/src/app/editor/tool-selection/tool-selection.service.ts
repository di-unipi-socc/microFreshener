import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectionService {

  public static readonly SERVICE = "service";
  public static readonly DATASTORE = "datastore";
  public static readonly COMMUNICATION_PATTERN = "communicationPattern";
  public static readonly MESSAGE_ROUTER = "messagerouter";
  public static readonly MESSAGE_BROKER = "messagebroker";
  public static readonly COMPUTE = "compute";

  public enabledActions;

  constructor() {
    this.enabledActions = {};
    this.enabledActions[ToolSelectionService.SERVICE] = false;
    this.enabledActions[ToolSelectionService.DATASTORE] = false;
    this.enabledActions[ToolSelectionService.MESSAGE_ROUTER] = false;
    this.enabledActions[ToolSelectionService.MESSAGE_BROKER] = false;
    this.enabledActions[ToolSelectionService.COMPUTE] = false;
  }

  enable(name: string, isActive: boolean) {
    console.debug("changing enable", name, isActive);
    this.enabledActions[name] = isActive;
  }

  getSelected() {
    let enabledTools = Object.keys(this.enabledActions).filter((tool) => this.enabledActions[tool]);
    if(enabledTools.length > 0) {
      return enabledTools[0];
    } else {
      return undefined;
    }
  }

  isAddNodeEnabled(): boolean {
    return this.enabledActions[ToolSelectionService.SERVICE] ||
            this.enabledActions[ToolSelectionService.DATASTORE] ||
            this.enabledActions[ToolSelectionService.MESSAGE_BROKER] ||
            this.enabledActions[ToolSelectionService.MESSAGE_ROUTER] ||
            this.enabledActions[ToolSelectionService.COMPUTE];
  }

}
