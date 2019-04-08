import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';
import { AnalyserService } from '../analyser.service';
import { GraphService } from "../graph.service";
import { MessageService } from 'primeng/primeng';
import { ANode } from '../analyser/node';

@Component({
  selector: 'app-dialog-analysis',
  templateUrl: './dialog-analysis.component.html',
  styleUrls: ['./dialog-analysis.component.css']
})
export class DialogAnalysisComponent implements OnInit {
  principles: Object[] = [];
  selectedPrinciples: Object[] = [];

  showSpinner:boolean = false;

  constructor(private gs: GraphService, private as: AnalyserService, private messageService: MessageService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { //public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.principles.push({ "name": "Independent Deployability", "value": "IndependentDeployability" });
    this.principles.push({ "name": "Horizontal Scalability", "value": "HorizontalScalability" });
    this.principles.push({ "name": "Isolate Failure", "value": "IsolateFailure" });
    this.principles.push({ "name": "Decentralise Everything", "value": "DecentraliseEverything" });
    this.selectedPrinciples = this.principles;
  }

  ngOnInit() {
  }


  save() {
    let parameters: string[] = this.selectedPrinciples.map(principle => { return principle['value'] });

    // upload the local graph to the server
    this.gs.uploadGraph()
      .subscribe(data => {
        // console.log(data)
        console.log("Graph uploaded correctly to the server", data);
        // run the analysis into the server
        this.as.runRemoteAnalysis(parameters)
          .subscribe(data=>{
            //TODO: pas to the close a error code () checkin the 
            this.ref.close();
          
            // (anodes:ANode[]) => {
            // anodes.forEach((node)=>{
            //   // update the smells into the UI.

            //   let n = this.gs.getGraph().getNode(node.name);
            //   node.getSmells().forEach((smell)=>{
            //     n.addSmell(smell);
            //   })
            // })
            // // TODO: where to put the analysed nodes ??
            // this.messageService.add({ severity: 'success', summary: 'Analyse received succesfully' });
            
            // this.updatePrinciplesForTreeNode(anodes);
          });
      });
    
  }

}
