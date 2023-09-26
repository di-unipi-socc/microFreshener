import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

import { environment } from '../../../environments/environment';
import { UserRole } from '../user-role';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  modelName: string; // name of the model

  hrefDownload = environment.serverUrl + '/api/export';

  constructor(
    private gs: GraphService,
    public dialogService: DialogService,
    private session: SessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  newFile() {
    this.gs.getGraph().clearGraph();
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
              this.loadGraph(data);
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
              this.loadGraph(data.graph);
              this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
          }
      });

  }

  loadGraph(data) {
    let graphJson = data;
    let role = this.session.getRole();
    this.gs.getGraph().clear();
    this.gs.getGraph().builtFromJSON(graphJson);
    if(role == UserRole.TEAM) {
      let teamName = this.session.getName();
      let team = this.gs.getGraph().getTeam(teamName);
      this.gs.getGraph().showOnlyTeam(team);
      this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
    }
    console.log(this.gs.getGraph().applyLayout("LR"));
    /*let paper = this.gs.getPaper();
    let paperArea = paper.getArea();
    let contentArea = paper.getContentArea();
    console.log("paperArea: %d,%d ; contentArea: %d,%d, contentArea position: %d,%d", paperArea.width, paperArea.height, contentArea.width, contentArea.height, contentArea.x, contentArea.y);
    paper.translate(-paperArea.width + (contentArea.width / 2), -paperArea.height + (contentArea.height / 2));*/
  }

}
