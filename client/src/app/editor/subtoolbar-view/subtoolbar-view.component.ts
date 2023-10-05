import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { GraphService } from '../../graph/graph.service';

@Component({
  selector: 'app-subtoolbar-view',
  templateUrl: './subtoolbar-view.component.html',
  styleUrls: ['./subtoolbar-view.component.css']
})
export class SubtoolbarViewComponent {

  viewIcon: string = "pi pi-th-large";
  viewMenuItems: MenuItem[] = [
      {
          label: 'All',
          icon: 'pi pi-fw pi-th-large',
          command: () => {
              this.viewIcon = "pi pi-th-large"
              this.maximizeTeam()
          }
      },
      {
          label: 'By teams',
          icon: 'pi pi-fw pi-users',
          command: () => {
              this.viewIcon = "pi pi-users"
              this.minimizeTeam()
          }
      }
  ];

  constructor(private gs: GraphService) {}

  maximizeTeam() {
    this.gs.getGraph().maximizeAllTeam();
    //this.messageService.add({ severity: 'success', summary: ` All graph visualized` });
}

minimizeTeam() {
    this.gs.getGraph().minimizeAllTeam();
    //this.messageService.add({ severity: 'success', summary: ` All team minimized` });
}

}
