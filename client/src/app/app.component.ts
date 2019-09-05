import { Component } from '@angular/core';
import { GraphService } from "./graph.service";
import { MessageService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { AnalyserService } from './analyser.service';
import { environment } from '../environments/environment';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DialogService] //, ConfirmationService]
})
export class AppComponent {
  title = 'microFreshener';

  display: boolean = false;

  items: MenuItem[];

  hrefDownload = environment.serverUrl + '/api/export';
  urlUpload = environment.serverUrl + '/api/import';
  urlRefineKubernetes = environment.serverUrl + '/api/refine';
  urlRefineIstio = environment.serverUrl + '/api/refine/istio';

  constructor(private gs: GraphService, private as: AnalyserService, private messageService: MessageService, public dialogService: DialogService) {


  }

  ngOnInit() {
    this.items = [
      {
        label: 'Account',
        icon: 'pi pi-fw pi-user',
        items: [
          { label: 'Detail', icon: "pi pi-user" },
          { label: 'Log out', icon: 'pi pi-sign-out' },
        ]
      }
    ];
  }

  onUpload(event) {
    this.download();
  }

  download() {
    this.gs.dowloadGraph()
      .subscribe((data) => {
        this.closeSidebar();
        console.log(data);
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.messageService.add({ severity: 'success', summary: 'Graph downloaded correctly', detail: '' });
      });
  }

  closeSidebar() {
    this.display = false;
  }

  downloadExample(name: string) {
    this.gs.downloadExample(name)
      .subscribe((data) => {
        this.gs.getGraph().builtFromJSON(data);
        this.gs.getGraph().applyLayout("LR");
        this.messageService.add({ severity: 'success', summary: `Graph ${name} loaded` });
      });
  }

}
