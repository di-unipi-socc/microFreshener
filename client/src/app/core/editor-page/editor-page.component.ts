import { Component } from '@angular/core';
import { ContextMenuAction } from 'src/app/editor/context-menu-action';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent {

  sidebar;

  selectedTeam;

  constructor() {
    this.sidebar = {
      viewIncomingTeams: false,
      viewTeamsInfo: false
    };
  }

  sidebarChange(sidebarUpdate) {
    for(let name in sidebarUpdate) {
      this.sidebar[name] = sidebarUpdate[name];
    }
  }

  onContextMenuAction(action: ContextMenuAction) {
    switch(action.label) {
      case "team-details":
        this.selectedTeam = <joint.shapes.microtosca.SquadGroup> action.target;
        this.sidebar.viewTeamsInfo = true;
        break;
    }
  }

}
