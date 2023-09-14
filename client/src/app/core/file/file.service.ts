import { EventEmitter, Injectable, Output } from '@angular/core';
import { DialogService } from 'primeng/api';
import { MessageService } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogImportComponent } from '../../editing/dialog-import/dialog-import.component';
import { DialogSelectRoleComponent } from '../dialog-select-role/dialog-select-role.component';

import { environment } from '../../../environments/environment';
import { UserRole } from '../user-role';

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
    this.confirmationService.confirm({
        header: 'New file',
        icon: 'pi pi-exclamation-triangle',
        message: 'Are you sure that you want to delete the current work and create a new one?',
        accept: () => {
            this.gs.getGraph().clearGraph();
        }
    });
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
              this.gs.getGraph().builtFromJSON(data);
              this.gs.getGraph().applyLayout("LR");
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
              this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
              this.selectRole();
          }
      });

  }

  public readonly TEAM_MEMBER_ROLE: string = "team";
  public readonly PRODUCT_OWNER_ROLE: string = "po";

  selectRole() {
      const ref = this.dialogService.open(DialogSelectRoleComponent, {
          header: 'Select your role',
          width: '50%'
      });
      ref.onClose.subscribe((data) => {
          console.log("The user declared " + data.role);
          this.roleChoice.emit(data.role);
      });
  }

}
