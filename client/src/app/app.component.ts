import { Component } from '@angular/core';
import { GraphService } from "./editing/model/graph.service";
import { MessageService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AnalyserService } from './refactoring/analyser/analyser.service';
import { environment } from '../environments/environment';

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

}
