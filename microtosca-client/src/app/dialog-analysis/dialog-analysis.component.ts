import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { AnalyserService } from '../analyser.service';
import { GraphService } from "../graph.service";
import { MessageService } from 'primeng/primeng';
import { ANode } from '../analyser/node';
import { Smell } from "../model/smell";
import { Principle } from '../model/principles';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';

interface Orchestrator {
  id?: number,
  name?: string,
  img?: string,
  resolvedSmells?: number[]
}

@Component({
  selector: 'app-dialog-analysis',
  templateUrl: './dialog-analysis.component.html',
  styleUrls: ['./dialog-analysis.component.css']
})
export class DialogAnalysisComponent implements OnInit {

  principles: Principle[] = [];
  selectedPrinciples: Principle[];

  smellsToBeAnalysed: Smell[];

  containerOrchestrators: Orchestrator[] = [];
  selectedOrchestrator: Orchestrator;

  constructor(private gs: GraphService, private as: AnalyserService, private messageService: MessageService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { //public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    this.containerOrchestrators = [
      { id: 1, name: 'General', img: "general.jpeg", resolvedSmells: [] },
      { id: 2, name: 'Kubernetes', img: "kubernetes.png", resolvedSmells: [1, 2, 3] },
      { id: 3, name: 'Docker Compose', img: "compose.png", resolvedSmells: [2, 3] },
      { id: 4, name: 'Open Shift', img: "openshift.png", resolvedSmells: [] },
    ];
    this.selectedOrchestrator = this.containerOrchestrators[0];

    


  }

  ngOnInit() {
    // this.as.getSmells().then(smells => this.smellsToBeAnalysed = smells);

    // this.as.getPrinciplesAndSmells().then(principles => {
    //   principles.forEach(principle => {
    //     var principleNode: TreeNode = <TreeNode>{ "label": principle.name, "key": principle.id, "data": principle.name, children: [] };
    //     principle.smells.forEach(smell => {
    //       principleNode.children.push(<TreeNode>{ "label": smell.name, "data": smell.name })
    //     })
    //     this.principles.push(principleNode);
    //   })
    // });

    this.as.getPrinciplesToAnalyse().then(principles => {
      this.selectedPrinciples = principles;
      this.principles = principles;
    });

  }

  orchestratorSelect(evt) {

    switch (evt.value.id) {
      case 1:
        console.log("dfaulr");
        break;
      case 2:
        console.log("kubernetes");
        break;

      default:
        break;
    }
  }

  save() {
    let parameters: string[] = this.selectedPrinciples.map(principle => principle.name);
    console.log(parameters);

    this.gs.uploadGraph()
      .subscribe(data => {
        this.as.runRemoteAnalysis(parameters)
          .subscribe(data => {
            //TODO: pass to the close a error code () checkin the 
            this.ref.close();
          });
      });

  }

}
