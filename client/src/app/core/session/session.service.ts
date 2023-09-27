import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { GraphService } from "../../editing/model/graph.service";
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

import { environment } from '../../../environments/environment';
import { UserRole } from '../user-role';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private name: string;
  private role: UserRole;
  private documentReady: boolean;
  private modelName: string; // name of the model
  //private hrefDownload = environment.serverUrl + '/api/export';

  constructor(
    private gs: GraphService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.documentReady = false;
  }

  login(username: string) {
    console.log("Logged as " + username);
    this.name = username;
    switch(username) {
      case "admin":
        this.role = UserRole.ADMIN;
        break;
      default:
        this.role = UserRole.TEAM;
    }
  }

  logout() {
    this.closeDocument();
    this.resetUserData();
  }

  getName(): string {
    return this.name;
  }

  getRole(): UserRole {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role == UserRole.ADMIN;
  }

  isTeam(): boolean {
    return this.role == UserRole.TEAM;
  }

  isDocumentReady(): boolean {
    return this.documentReady;
  }

  newFile() {
    this.gs.getGraph().clearGraph();
    this.gs.fitContent(400);
    this.documentReady = true;
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
              this.gs.fitContent();
              this.documentReady = true;
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
              this.gs.fitContent();
              this.documentReady = true;
              this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
          }
      });

  }

  loadGraph(data) {
    let graphJson = data;
    let role = this.getRole();
    this.gs.getGraph().clear();
    this.gs.getGraph().builtFromJSON(graphJson);
    if(role == UserRole.TEAM) {
      let teamName = this.getName();
      let team = this.gs.getGraph().getTeam(teamName);
      this.gs.getGraph().showOnlyTeam(team);
      this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
    }
    console.log(this.gs.getGraph().applyLayout("LR"));
  }

  closeDocument() {
    this.gs.hideGraph();
    this.documentReady = false;
  }

  resetUserData() {
    this.name = undefined;
    this.role = undefined;
  }

}
