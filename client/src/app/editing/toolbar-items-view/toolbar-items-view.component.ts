import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar-items-view',
  templateUrl: './toolbar-items-view.component.html',
  styleUrls: ['./toolbar-items-view.component.css']
})
export class ToolbarItemsViewComponent {

  viewIcon: string = "pi pi-th-large";
  viewMenuItems: MenuItem[] = [
      {
          label: 'All',
          icon: 'pi pi-fw pi-th-large',
          command: () => {
              this.viewIcon = "pi pi-th-large"
              //this.maximizeTeam()
          }
      },
      {
          label: 'By teams',
          icon: 'pi pi-fw pi-users',
          command: () => {
              this.viewIcon = "pi pi-users"
              //this.minimizeTeam()
          }
      },
      {
          label: 'One team',
          icon: 'pi pi-fw pi-user',
          command: () => {
              this.viewIcon = "pi pi-user"
              //this.showOneTeam();
          }
      }
  ];

}
