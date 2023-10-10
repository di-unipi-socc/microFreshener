import { Component } from '@angular/core';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.css']
})
export class EditorPageComponent {

  sidebar;

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

}
