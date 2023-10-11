import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectionService {

  public static readonly SERVICE = "service";
  public static readonly LINK = "link";
  public static readonly COMMUNICATION_PATTERN = "communicationPattern";
  public static readonly MESSAGE_ROUTER = "messagerouter";
  public static readonly MESSAGE_BROKER = "messagebroker";
  public static readonly DATASTORE = "datastore";

  public enabledActions;

  constructor() {
    this.enabledActions = {};
    this.enabledActions[ToolSelectionService.SERVICE] = false;
    this.enabledActions[ToolSelectionService.LINK] = false;
    this.enabledActions[ToolSelectionService.MESSAGE_ROUTER] = false;
    this.enabledActions[ToolSelectionService.MESSAGE_BROKER] = false;
    this.enabledActions[ToolSelectionService.DATASTORE] = false;
  }

  enable(name: string, isActive: boolean) {
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

  isAddNodeEnabled(cell?): boolean {
    return this.enabledActions[ToolSelectionService.SERVICE] ||
            this.enabledActions[ToolSelectionService.DATASTORE] ||
            this.enabledActions[ToolSelectionService.MESSAGE_BROKER] ||
            this.enabledActions[ToolSelectionService.MESSAGE_ROUTER];
  }

  isAddLinkEnabled(): boolean {
    return this.enabledActions[ToolSelectionService.LINK];
  }
}
