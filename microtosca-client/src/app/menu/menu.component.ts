import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GraphService } from "../graph.service";

import { TreeNode, MessageService } from 'primeng/primeng';
import { AnalyserService } from '../analyser.service';
import { ANode } from '../analyser/node';
import { Antipattern } from '../analyser/antipattern';
import { DialogService } from 'primeng/api';
import { DialogAnalysisComponent } from '../dialog-analysis/dialog-analysis.component';

import {MenuItem} from 'primeng/api';

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

  constructor(private gs: GraphService, private as: AnalyserService,  public dialogService: DialogService, private messageService: MessageService) {
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
                      {label: 'Project'},
                      {label: 'Other'},
                  ]
              },
              {label: 'Open'},
              {label: 'Quit'}
          ]
      },
      {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
              {label: 'Delete', icon: 'pi pi-fw pi-trash'},
              {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
          ]
      }
  ];

    this.nodes = [];
  
  
  }

  nodeSelect(event) {
    //A node in the PrimeMG tree has been selected
    //event.node = selected node
    console.log(event.node);
    if (event.node.type == "principle") {
      console.log("Selected principle");
      event.node.children.forEach(antipattern => {
        this._onSelectedAntipattern(antipattern.data, true);
      });
    }
    else {
      console.log("selected antipattern");
      this._onSelectedAntipattern(event.node.data, true);
    }
  }

  nodeUnSelect(event) {
    if (event.node.type == "principle") {
      event.node.children.forEach(antipattern => {
        this._onSelectedAntipattern(antipattern.data, false);
      });
    } else
      this._onSelectedAntipattern(event.node.data, false);
  }

  analyse() {
    const ref = this.dialogService.open(DialogAnalysisComponent, {
      header: 'Select Analysis to perform',
      width: '40%'
    });
    ref.onClose.subscribe(() => {
        this.messageService.add({ severity: 'success', summary: "Analysis sufccesfully" });
    });
    // console.log("selected principles:")
    // let parameters: string[] = this.selectedPrinciples.map(principle => { return principle['value'] });

    // this.gs.uploadGraph()
    //   .subscribe(data => {
    //     console.log(data);
    //     console.log("Graph uploaded correctly to the server");

    //     //run the analysis
    //     this.as.runRemoteAnalysis(parameters)
    //       .subscribe((anodes:ANode[]) => {
    //         console.log(anodes);
    //         this.messageService.add({ severity: 'success', summary: 'Analyse received succesfully' });
    //         this.updatePrinciplesForTreeNode(anodes);
    //       });
    //   });
  }

  updatePrinciplesForTreeNode(anodes:ANode[]) {
   this.nodes = [];
    anodes.forEach((anode)=>{
      var n = {'label': anode.name,  collapsedIcon: 'fa-folder', expandedIcon: 'fa-folder-open', selectable:false};
      n['type'] = (anode.hasSmells()) ? "nok" :"ok";
      n['children'] = [];
      anode.getSmells().forEach((smell)=>{
        var p = {'label':smell.name, selectable:true, 'type':"smell", 'children':[]};
        smell.getCause().forEach((causa)=>{
            // console.log(causa);
            // console.log("O£JOEJ");
            p['children'].push({'data': causa, 'type':"causa"})
        })
        n['children'].push(p);
      })
      this.nodes.push(n);
    })


    // this.gs.getNodes().forEach((node)=>{
    //   console.log("adding node");
    //   var principles = node.getViolatedPrinciples();
    //   var n = {'label': node.name,  collapsedIcon: 'fa-folder', expandedIcon: 'fa-folder-open', selectable:false};
    //   if(principles.length == 0)
    //     n['type'] = "ok"; // type used to show the green icon
    //   else
    //     n['children'] = [];

    //   this.nodes.push(n);

    //   principles.forEach((principle)=>{
    //       var p = {'label':principle.name, selectable:true, 'type':"principle"};
    //       n['children'].push(p);
    //       if(principle['antipatterns']){
    //         p['children'] = [];
    //         principle['antipatterns'].forEach((antipattern)=>{
    //           p['children'].push({'label':antipattern.name, 'data': antipattern, 'type':"antipattern"})
    //         })
    //       }
    //   })
    // })
    console.log(this.nodes);
  }

  _onSelectedAntipattern(antipattern, state: boolean) {

    console.log(antipattern);
    // {name: "direct_Interaction", 
    //   cause :[ {
    //     source:"order (service)"
    //     target: "shipping (service)"
    //     type: "runtime"
    //     }]
    antipattern.cause.forEach(causa => {
      console.log(causa);
      // let source  = this.gs.getNode(causa['source']);
      // if(causa['type'] == "deploymenttime"){
      //   let link = source.getDeploymnetTimeLinkTo(causa['target']);
      //   link.setBadInteraction(state);
      // }
      // else{
      //   let link= source.getRunTimeLinkTo(causa['target']);
      //   link.setBadInteraction(state);
      // }
    });

  }

}
