import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import  {GraphService} from "../graph.service";
import { Node } from '../d3';
import { TreeNode } from 'primeng/primeng';
import {TreeDragDropService} from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
 
  principles:Object[] = [];
  selectedPrinciples: Object[] = [];

  nodes: TreeNode[]; // nodes to be shown in the tree (primeNg)

  constructor( private gs: GraphService) {
    //TODO: get the princniples with a service from the server

    this.principles.push({"name":"Independent Deployability", "value":"IndependentDeployability"});
    this.principles.push({"name":"Horizontal Scalability", "value":"HorizontalScalability"});
    this.principles.push({"name":"Isolate Failure", "value":"IsolateFailure"});
    this.principles.push({"name":"Decentralise Everything", "value":"DecentraliseEverything"});

    this.selectedPrinciples = this.principles;
  } 

  ngOnInit() { 
    /*
    [
      {'label': node1}
    ]

    */
    this.nodes = [];
      // {
      //   label: 'node1',
      //   collapsedIcon: 'fa-folder',
      //   expandedIcon: 'fa-folder-open',
      //   children: [
      //     {
      //       label: 'antipattern 1',
      //       collapsedIcon: 'fa-folder',
      //       expandedIcon: 'fa-folder-open',
      //       children: [
      //         {
      //           label: 'refactoring1',
      //           icon: 'fa-file-o'
      //         },
      //         {
      //           label: 'refactorin 2',
      //           icon: 'fa-file-o'
      //         }
      //       ]
      //     },
      //     {
      //       label: 'antipattern2',
      //       collapsedIcon: 'fa-folder',
      //       expandedIcon: 'fa-folder-open',
      //       children: [
      //         {
      //           label: 'refactoring1',
      //           icon: 'fa-file-o'
      //         },
      //       ]
      //     },
  
      //   ]
      // },
      // {
      //   label: 'node2 ',
      //   collapsedIcon: 'fa-folder',
      //   expandedIcon: 'fa-folder-open',
      //   children: [
      //     {
      //       label: 'antipattern2 ',
      //       collapsedIcon: 'fa-folder',
      //       expandedIcon: 'fa-folder-open',
      //       children: [
      //         {
      //           label: 'refactoring1',
      //           icon: 'fa-file-o'
      //         },
      //         {
      //           label: 'refactoring  2',
      //           collapsedIcon: 'fa-folder',
      //           expandedIcon: 'fa-folder-open'
      //         },
      //       ]
      //     },
      //   ]
      // }
    // ];
  }

  nodeSelect(event) {
    //event.node = selected node
    console.log(event.node);
    if(event.node.type == "principle"){
      console.log("selected principle");
      event.node.children.forEach(antipattern => {
        this._onSelectedAntipattern(antipattern.data, true);
      });
    }
    else{
      console.log("selected antipattern");
      this._onSelectedAntipattern(event.node.data, true);
    }
  }

  nodeUnSelect(event){
    if(event.node.type == "principle"){
      event.node.children.forEach(antipattern => {
        this._onSelectedAntipattern(antipattern.data, false);
      });
    }else
      this._onSelectedAntipattern(event.node.data, false);
  }

  analyse(){
    console.log("selected principles:")
    let t:string[] = this.selectedPrinciples.map(principle => {return principle['value']});
    // upload the graph to the server
    this.gs.uploadGraph()
      .subscribe(data => {
        // console.log(data);
        console.log("Graph uploaded correctly to the server");
        
        //run the analysis
        this.gs.runRemoteAnalysis(t)
          .subscribe((data) => {
            data['nodes'].forEach(element => {
              console.log(element);
              console.log("Analysis received");
              let node:Node= this.gs.graph.getNodeByName(element.name);
              node.principles = element.principles;
              // remove the red links setting the bad interatiosn to false
              this.gs.clearBadInteractions();
              
            });
            this.updatePrinciplesForTreeNode();
        });
      });
  }

  updatePrinciplesForTreeNode(){
    this.nodes = [];
    this.gs.getNodes().forEach((node)=>{
      console.log("adding node");
      var principles = node.getViolatedPrinciples();
      var n = {'label': node.name,  collapsedIcon: 'fa-folder', expandedIcon: 'fa-folder-open', selectable:false};
      if(principles.length == 0)
        n['type'] = "ok"; // type used to show the green icon
      else
        n['children'] = [];

      this.nodes.push(n);

      principles.forEach((principle)=>{
          var p = {'label':principle.name, selectable:true, 'type':"principle"};
          n['children'].push(p);
          if(principle['antipatterns']){
            p['children'] = [];
            principle['antipatterns'].forEach((antipattern)=>{
              p['children'].push({'label':antipattern.name, 'data': antipattern, 'type':"antipattern"})
            })
          }
      })
    })
    console.log(this.nodes);
  }

  _onSelectedAntipattern(antipattern, state:boolean){
    
    console.log(antipattern);
    // {name: "direct_Interaction", 
    //   cause :[ {
    //     source:"order (service)"
    //     target: "shipping (service)"
    //     type: "runtime"
    //     }]
    antipattern.cause.forEach(causa => {
      let source  = this.gs.getNode(causa['source']);
      if(causa['type'] == "deploymenttime"){
        let link = source.getDeploymnetTimeLinkTo(causa['target']);
        link.setBadInteraction(state);
      }
      else{
        let link= source.getRunTimeLinkTo(causa['target']);
        link.setBadInteraction(state);
      }
    });

    }

}
