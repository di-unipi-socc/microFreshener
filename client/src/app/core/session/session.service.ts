import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { GraphService } from "../../graph/graph.service";
import { DialogImportComponent } from '../dialog-import/dialog-import.component';

// import { environment } from '../../../environments/environment';
import { UserRole } from '../user-role';
import { PermissionsService } from 'src/app/core/permissions/editor-permissions.service';
import { EditorNavigationService } from 'src/app/editor/navigation/navigation.service';
import { TeamsService } from 'src/app/teams/teams.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private teamName: string;
  private role: UserRole;
  private documentReady: boolean;
  private modelName: string; // name of the model
  // private hrefDownload = environment.serverUrl + '/api/export';

  constructor(
    private gs: GraphService,
    private navigation: EditorNavigationService,
    private permissions: PermissionsService,
    private teams: TeamsService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.documentReady = false;
  }

  login(username: string) {
    switch(username) {
      case "admin":
        this.role = UserRole.ADMIN;
        break;
      default:
        this.role = UserRole.TEAM;
    }
    this.teamName = username;
  }

  logout() {
    this.closeDocument();
    this.resetUserData();
  }

  getTeamName(): string {
    return this.teamName;
  }

  getRole(): UserRole {
    return this.role;
    //return UserRole.ADMIN; // DEBUG
  }

  isAdmin(): boolean {
    return this.role == UserRole.ADMIN;
    //return true; // DEBUG
  }

  isTeam(): boolean {
    return this.role == UserRole.TEAM;
    //return false; // DEBUG
  }

  isDocumentReady(): boolean {
    return this.documentReady;
  }

  newFile() {
    this.gs.getGraph().clearGraph();
    this.navigation.fitContent(400);
    this.modelName = "";
    this.gs.getGraph().setName(this.modelName);
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

  saveFile() {
    this.gs.uploadGraph().subscribe(res => {
      window.open(environment.serverUrl + '/api/export');
      if (res.msg) {
          this.messageService.add({ severity: 'success', detail: res.msg, summary: 'Saved' });
      }
  });
  }

  downloadExample(name: string) {
      this.gs.downloadExample(name)
          .subscribe((data) => {
              this.loadGraph(data);
              this.navigation.fitContent();
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
              this.navigation.fitContent();
              this.documentReady = true;
              this.messageService.add({ severity: 'success', summary: 'Graph uploaded correctly', detail: data.msg });
          }
      });

  }

  loadGraph(graphJson) {
    this.gs.load(graphJson);
    this.modelName = this.gs.getGraph().getName();
    console.debug("Loaded graph", this.gs.getGraph().getName());
    let role = this.getRole();
    switch(role) {
      case UserRole.TEAM:
        let teamName = this.getTeamName();
        let team = this.gs.getGraph().getTeam(teamName);
        this.gs.getGraph().showOnlyTeam(team);
        this.messageService.add({ severity: 'success', summary: "One team show", detail: ` Team ${team.getName()} shown` });
        this.permissions.updatePermissions(role, teamName);
        break;
      default:
        this.permissions.updatePermissions(role);
    }
    this.teams.hideTeams();
    this.gs.getGraph().applyLayout("LR");
  }

  closeDocument() {
    this.gs.getGraph().hideGraph();
    this.documentReady = false;
  }

  resetUserData() {
    this.teamName = undefined;
    this.role = undefined;
  }

}
