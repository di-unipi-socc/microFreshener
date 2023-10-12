import { Component } from '@angular/core';
import { ContextMenuAction } from 'src/app/editor/context-menu-action';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent {

  sidebar;

  viewTeamsInfoConfig: {
    list: boolean;
    selectedTeam: joint.shapes.microtosca.SquadGroup
  }

  selectedTeam;

  constructor() {
    this.sidebar = {
      viewIncomingTeams: false,
      viewTeamsInfo: false
    };

    this.viewTeamsInfoConfig = {
      list: false,
      selectedTeam: null
    };
  }

  onSidebarChange(sidebarUpdate) {
    this.sidebar[sidebarUpdate.name] = sidebarUpdate.visible;
    if(sidebarUpdate.name == "viewTeamsInfo") {
      if(sidebarUpdate.visible) {
        this.viewTeamsInfoConfig.list = true;
      } else {
        this.viewTeamsInfoConfig.selectedTeam = null;
        this.viewTeamsInfoConfig.list = false;
      }
    }
  }

  onContextMenuAction(action: ContextMenuAction) {
    switch(action.label) {
      case "team-details":
        this.sidebar.viewTeamsInfo = true;
        this.viewTeamsInfoConfig.list = false;
        this.viewTeamsInfoConfig.selectedTeam = <joint.shapes.microtosca.SquadGroup> action.target;
        break;
    }
  }

}
