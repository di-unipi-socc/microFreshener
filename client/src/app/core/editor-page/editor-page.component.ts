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

  selectedSmell;

  constructor() {
    this.sidebar = {
      viewIncomingTeams: false,
      viewTeamsInfo: false,
      viewTeamsRelations: false,
      viewSmell: false
    };

    this.viewTeamsInfoConfig = {
      list: false,
      selectedTeam: undefined
    };
  }

  onSidebarChange(sidebarUpdate) {
    this.sidebar[sidebarUpdate.name] = sidebarUpdate.visible;

    switch(sidebarUpdate.name) {
      case "viewTeamsInfo":
          if(sidebarUpdate.visible) {
            this.viewTeamsInfoConfig.list = true;
          } else {
            console.log("selecting team", this.viewTeamsInfoConfig.selectedTeam)
            this.viewTeamsInfoConfig.selectedTeam = undefined;
            this.viewTeamsInfoConfig.list = false;
          }
        break;
    }
  }

  onContextMenuAction(action: ContextMenuAction) {
    switch(action.label) {
      case "team-details":
        if(!this.sidebar.viewTeamsInfo) {
          this.sidebar.viewTeamsInfo = true;
          this.viewTeamsInfoConfig.list = false;
        }
        this.viewTeamsInfoConfig.selectedTeam = <joint.shapes.microtosca.SquadGroup> action.target;
        break;
      case "smell-details":
        this.selectedSmell = action.target;
        break;
    }
  }

}
