import { EventEmitter, Injectable, Output } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogImportComponent } from '../dialog-import/dialog-import.component';
import { DialogSelectRoleComponent } from '../dialog-select-role/dialog-select-role.component';

import { environment } from '../../../environments/environment';
import { UserRole } from '../user-role';
import { DialogSelectTeamComponent } from 'src/app/teams/dialog-select-team/dialog-select-team.component';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  modelName: string; // name of the model

  hrefDownload = environment.serverUrl + '/api/export';

  @Output() roleChoice = new EventEmitter<UserRole>();

  constructor(private gs: GraphService, public dialogService: DialogService, private messageService: MessageService, private confirmationService: ConfirmationService) {
  }

  newFile() {
    this.gs.getGraph().clearGraph();
    this.roleChoice.emit(UserRole.ADMIN);
  }

  rename() {
      this.gs.getGraph().setName(this.modelName);
      this.messageService.clear();
      this.messageService.add({ severity: 'success', summary: 'Renamed correctly', detail: "New name [" + this.gs.getGraph().getName() + "]" });
  }

  save() {
      this.gs.uploadGraph().subscribe(res => {
          if (res.msg)
              this.messageService.add({ severity: 'success', detail: res.msg, summary: 'Saved' });
      });
  }

  downloadExample(name: string) {
      this.gs.downloadExample(name)
          .subscribe((data) => {
              this.loadGraphAsRole(data);
              this.messageService.add({ severity: 'success', summary: 'Loaded example', detail: `Example ${name} ` });
          });
  }

  import() {
      const ref = this.dialogService.open(DialogImportComponent, {
          header: 'Import MicroTosca',
          width: '70%'
      });
      ref.onClose.subscribe((data) => {
          if (data.msg) {
              console.log(data);
              this.loadGraphAsRole(data.graph);
              this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
          }
      });

  }

  public readonly TEAM_MEMBER_ROLE: string = "team";
  public readonly PRODUCT_OWNER_ROLE: string = "po";

  loadGraphAsRole(data) {
    let graphJson = data;
    const ref = this.dialogService.open(DialogSelectRoleComponent, {
        header: 'Select your role',
        width: '50%'
    });
    ref.onClose.subscribe((data) => {
        switch(data.role) {
            case UserRole.TEAM:
                this.loadGraphAsTeamMember(graphJson);
                
                break;
            case UserRole.ADMIN:
                this.justLoadGraph(graphJson);
                this.roleChoice.emit(UserRole.ADMIN);
                break;
        }
    });
  }

  loadGraphAsTeamMember(graphJson) {
    this.justLoadGraph(graphJson);
    this.gs.hideGraph();
    const ref = this.dialogService.open(DialogSelectTeamComponent, {
        header: 'Select a Team',
        width: '50%',
    });
    ref.onClose.subscribe((data) => {
        if (data.show) {
            var team = data.show;
            this.gs.getGraph().showOnlyTeam(team);
            this.roleChoice.emit(UserRole.TEAM);
            this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
        }
    });
  }

  justLoadGraph(graphJson) {
    this.gs.getGraph().builtFromJSON(graphJson);
    this.gs.getGraph().applyLayout("LR");
  }

  // To be changed with "execute" function
  // this.roleChoice.emit(data.role);

}
