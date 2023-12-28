import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AnalyserService } from '../analyser.service';
import { Smell } from "../../graph/model/smell";
import { PrincipleRequest } from '../principles';
import { SessionService } from 'src/app/core/session/session.service';

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

  principles: PrincipleRequest[] = [];
  selectedSmells: Smell[] = [];

  containerOrchestrators: Orchestrator[] = [];
  selectedOrchestrator: Orchestrator;

  constructor(private as: AnalyserService, private session: SessionService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

    this.containerOrchestrators = [
      { id: 1, name: 'Custom', img: "general.jpeg", resolvedSmells: [] },
      { id: 2, name: 'Kubernetes', img: "kubernetes.png", resolvedSmells: [1, 2, 3] },
      { id: 3, name: 'Docker Compose', img: "compose.png", resolvedSmells: [3] },
      { id: 4, name: 'Open Shift', img: "openshift.png", resolvedSmells: [5,6,7] },
    ];
    this.selectedOrchestrator = this.getOrchestratorById(1);
  }

  ngOnInit() {
    this.as.getPrinciplesToAnalyse().then(principles => {
      principles = this.removeTeamSmellsIfTeamMember(principles);
      principles.forEach(principle => {
        principle.smells.forEach(smell => {
          this.selectedSmells.push(smell);
        })
      })
      this.principles = principles;
    });

  }

  removeTeamSmellsIfTeamMember(principles: PrincipleRequest[]) {
    if(this.session.isTeam()) {
    principles.forEach(principle => {
      principle.smells = principle.smells.filter(smell => smell.id != 7 && smell.id != 8 && smell.id != 9);
    });
    }
    return principles;
  }

  discardSmellsWithIDIn(ids: number[]){
    let selectedSmells: Smell[] = [];
    this.principles.forEach(principle=>{
      principle.smells.forEach(smell => {
        if(! ids.includes(smell.id)){
          selectedSmells.push(smell);
        }
      })
    });
    return selectedSmells;
  }

  getOrchestratorById(id:number){
    return this.containerOrchestrators.find(or => or.id == id);
  }

  orchestratorSelect(evt) {
    this.selectedSmells = this.discardSmellsWithIDIn(evt.value.resolvedSmells); 
    console.log(this.selectedSmells);
  }

  save() {
    this.ref.close({"selected_smells": this.selectedSmells});
  }

}
