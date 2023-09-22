import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogSelectTeamComponent } from 'src/app/teams/dialog-select-team/dialog-select-team.component';
import { GraphService } from '../model/graph.service';

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
      },
      {
          label: 'One team',
          icon: 'pi pi-fw pi-user',
          command: () => {
              this.viewIcon = "pi pi-user"
              this.showOneTeam();
          }
      }
  ];

  constructor(private dialogService: DialogService, private gs: GraphService) {}

  maximizeTeam() {
    this.gs.getGraph().maximizeAllTeam();
    //this.messageService.add({ severity: 'success', summary: ` All graph visualized` });
}

minimizeTeam() {
    this.gs.getGraph().minimizeAllTeam();
    //this.messageService.add({ severity: 'success', summary: ` All team minimized` });
}

showOneTeam() {
    const ref = this.dialogService.open(DialogSelectTeamComponent, {
        header: 'Select a Team',
        width: '50%',
    });
    ref.onClose.subscribe((data) => {
        if (data.show) {
            var team = data.show;
            this.gs.getGraph().showOnlyTeam(team);
            //this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
        }
    });
}

}
