import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GraphService } from '../../graph/graph.service';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-subtoolbar-teams',
  templateUrl: './subtoolbar-teams.component.html',
  styleUrls: ['./subtoolbar-teams.component.css']
})
export class SubtoolbarTeamsComponent {

  menuitems: MenuItem[];

  constructor(private teams: TeamsService, private dialogService: DialogService, private gs: GraphService) {

  }

  addTeam() {
    const ref = this.dialogService.open(DialogAddTeamComponent, {
        header: 'Add Team',
        width: '50%',
    });
    ref.onClose.subscribe((data) => {
        this.teams.addTeam(data.name);
        //this.messageService.add({ severity: 'success', summary: `Team ${data.name} inserted correctly` });
    });
}

}
