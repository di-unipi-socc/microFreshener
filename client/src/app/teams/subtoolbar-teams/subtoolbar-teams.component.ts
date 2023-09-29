import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogAddTeamComponent } from '../dialog-add-team/dialog-add-team.component';
import { AddTeamGroupCommand } from '../../graph/graph-command';
import { CommandInvoker } from 'src/app/commands/invoker/command-invoker';
import { DialogService } from 'primeng/dynamicdialog';
import { GraphService } from '../../graph/graph.service';

@Component({
  selector: 'app-subtoolbar-teams',
  templateUrl: './subtoolbar-teams.component.html',
  styleUrls: ['./subtoolbar-teams.component.css']
})
export class SubtoolbarTeamsComponent {

  menuitems: MenuItem[];

  constructor(private graphInvoker: CommandInvoker, private dialogService: DialogService, private gs: GraphService) {

  }

  addTeam() {
    const ref = this.dialogService.open(DialogAddTeamComponent, {
        header: 'Add Team',
        width: '50%',
    });
    ref.onClose.subscribe((data) => {
        this.graphInvoker.executeCommand(new AddTeamGroupCommand(this.gs.getGraph(), data.name));
        //this.messageService.add({ severity: 'success', summary: `Team ${data.name} inserted correctly` });
    });
}

}
