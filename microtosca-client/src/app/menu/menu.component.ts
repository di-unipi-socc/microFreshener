import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GraphService } from "../graph.service";

import { TreeNode, MessageService } from 'primeng/primeng';
import { AnalyserService } from '../analyser.service';
import { ANode } from '../analyser/node';
import { DialogService } from 'primeng/api';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [DialogService]
})
export class MenuComponent implements OnInit {

  principles: Object[] = [];
  selectedPrinciples: Object[] = [];

  items: MenuItem[];



  nodes: TreeNode[]; // nodes to be shown in the tree (primeNg)

  constructor(private gs: GraphService, private as: AnalyserService, public dialogService: DialogService, private messageService: MessageService) {
    //TODO: get the princniples with a service from the server
    this.principles.push({ "name": "Independent Deployability", "value": "IndependentDeployability" });
    this.principles.push({ "name": "Horizontal Scalability", "value": "HorizontalScalability" });
    this.principles.push({ "name": "Isolate Failure", "value": "IsolateFailure" });
    this.principles.push({ "name": "Decentralise Everything", "value": "DecentraliseEverything" });

    this.selectedPrinciples = this.principles;
  }

  ngOnInit() {
    this.items = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'Project' },
            { label: 'Other' },
          ]
        },
        { label: 'Open' },
        { label: 'Quit' }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'Delete', icon: 'pi pi-fw pi-trash' },
          { label: 'Refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

    this.nodes = [];

  }


  analyse() {
    const ref = this.dialogService.open(DialogAnalysisComponent, {
      header: 'Select Analysis to perform',
      width: '40%'
    });
    ref.onClose.subscribe(() => {
      this.messageService.add({ severity: 'success', summary: "Smells shown succesfully" });
    });
  }

}
