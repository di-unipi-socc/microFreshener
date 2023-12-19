import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { GraphService } from '../graph/graph.service';

import { Principle } from '../graph/model/principles';
import { Smell } from '../graph/model/smell';

import { CommunicationPattern } from "../graph/model/communicationpattern";
import { SmellFactoryService } from './smells/smell-factory.service';
//import { Analysed } from './analysed'; // Unused at the moment
import { GroupSmellObject } from './smells/smell';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})

export class AnalyserService {


  private analysisUrl = environment.serverUrl + '/api/analyse';
  private anySmell: boolean;
  
  /*nodesWithSmells: Analysed<joint.shapes.microtosca.Node>[] = [];   // list of analysed nodes in analysis response
  groupsWithSmells: Analysed<joint.shapes.microtosca.Group>[] = []; // list of analysed groups in analysis response
  groupMembersCausingSmells: Analysed<joint.shapes.microtosca.Node>[] = []; // group smells duplication in group member nodes*/

  constructor(
    private http: HttpClient,
    private gs: GraphService,
    private smellFactory: SmellFactoryService
  ) { }

  /*getSmellsCount(){
    var num_smells = 0;
    this.nodesWithSmells.forEach((anode)=> {
      num_smells +=  anode.getSmells().length;
    });
    this.groupsWithSmells.forEach((agroup)=> {
      num_smells +=  agroup.getSmells().length;
    });

    return num_smells
  }*/
  
  areThereSmells(): boolean {
    return this.anySmell;
  }

  showSmells() {
    this.showNodeSmells();
    this.showGroupSmells();
  }

  private showNodeSmells() {
    this.gs.graph.getNodes().forEach((n: joint.shapes.microtosca.Node) => { n.showSmells(); });
  }

  private showGroupSmells() {
    this.gs.graph.getTeamGroups().forEach((t) => { t.showSmells(); });
    // Edge Group element doesn't show smells
  }

  // Remove the "smells" icons in the nodes and groups
  clearSmells() {
    this.gs.graph.getNodes().forEach(node => { node.resetSmells(); });
    this.gs.graph.getGroups().forEach(group => { group.resetSmells(); });
  }

  getPrinciplesToAnalyse() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => (<Principle[]>res.data)
      .filter(principle => principle.id != 1))
  }

  getCommunicationPatterns() {
    return this.http.get<any>('assets/data/communicationpatterns.json')
      .toPromise()
      .then(res => <CommunicationPattern[]>res.data);
  }

  getPrinciplesAndSmells() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => <Principle[]>res.data);
  }

  getSmells() {
    return this.http.get<any>('assets/data/smells.json')
      .toPromise()
      .then(res => <Smell[]>res.data);
  }

  getSmellById(id: number) {
    return this.http.get<any>('assets/data/smells.json')
      .toPromise()
      .then(res => (<Smell[]>res.data).find(smell => smell.id == id))//smell.id === id))
  }

  runRemoteAnalysis(smells: Smell[] = null){

    this.clearSmells();

    let smells_ids: number[] = []; 
    // if(smells)
    smells_ids = smells.map(smell => smell.id);
    // else
    //  this.getSmells().then(smells =>{ 
    //     smells_ids =  smells.map(smell => smell.id);
    //     console.log(smells_ids);
    // });

    /*
      {
        smell: {
            name: "WobblyServicINTeractions"
            id: 1
        }
      }
    */

    const params = new HttpParams().set('smells', smells_ids.join());
      console.debug("running remote analysis")
    // Maybe instead of a get is s POST operation.
    return this.http.get(this.analysisUrl, { params })
      .pipe(
        map((response: Response) => {

          console.debug("ANALYSIS RESPONSE", response);

          response['groups']?.forEach((groupJson) => {
            console.debug("Parsing", groupJson['name']);
            // Build the smells of the group
            let group = this.gs.graph.findGroupByName(groupJson['name']);
            let groupSmells: GroupSmellObject[] = groupJson['smells'].map((smellJson) => this.smellFactory.getGroupSmell(smellJson, group));
            groupSmells.forEach((groupSmell) => {
              groupSmell.getNodeBasedCauses()
                        .concat(groupSmell.getLinkBasedCauses().flatMap((link) => [<joint.shapes.microtosca.Node> link.getSourceElement(), <joint.shapes.microtosca.Node> link.getTargetElement()]))
                        .reduce((acc, node) => acc.add(node), new Set<joint.shapes.microtosca.Node>())
                        .forEach((n) => { console.debug("Adding", groupSmell.getName(), "to", n.getName()); n.addSmell(groupSmell) });
            })
          });

          response['node']?.forEach((nodeJson) => {
            console.debug("Parsing", nodeJson['name']);
            let node = this.gs.graph.findNodeByName(nodeJson['name']);
            let nodeSmells = nodeJson['smells'].map((smellJson) => this.smellFactory.getNodeSmell(smellJson, node));
            nodeSmells.forEach((nodeSmell) => {
              nodeSmell.getCauses().forEach((n) => { console.debug("Adding", nodeSmell.getName(), "to", n.getName()); n.addSmell(nodeSmell) });
            })
          });

          // let nodeIgnoreAlwaysSmells:string[];
          // this.gs.getGraph().getNodes().forEach(node=>{
          //   // console.log(node.getName());
          //   // console.log(node.getIgnoreAlwaysSmells());
          //   // nodeIgnoreAlwaysSmells.push(`${node.getName()}::`)
          //   //   node.getIgnoreAlwaysSmells().forEach(smell=>{

          //   //   })
          // })

          // return this.http.post(this.analysisUrl, { params })
          //   .subscribe((data) =>{
          //     console.log(response);
          //   });
          // TODO: the analysis should send ignore always command to the analyser.

          /*console.debug("ANALYSIS RESPONSE", response);
          this.clearSmells(); 
          // reset analysed node array
          this.nodesWithSmells = [];
          // TODO: saved the analysed node ?? in order to have the history of the analysis.
          response['nodes'].forEach((nodeJson) => {
            let node = this.gs.graph.findNodeByName(nodeJson['name']);
            let nodeSmells = nodeJson['smells'].map((smellJson) => this.smellFactory.getNodeSmell(smellJson, node));
            let anode = Analysed.getBuilder<joint.shapes.microtosca.Node>()
                                .setElement(node)
                                .setSmells(nodeSmells)
                                .build();
            this.nodesWithSmells.push(anode);
          });

          this.groupsWithSmells = [];
          this.groupMembersCausingSmells = [];
          response['groups'].forEach((groupJson) => {
            // Build the smells of the group
            let group = this.gs.graph.findGroupByName(groupJson['name']);
            let groupSmells: GroupSmellObject[] = groupJson['smells'].map((smellJson) => this.smellFactory.getGroupSmell(smellJson, group));
            groupSmells.forEach((groupSmell) => {
              groupSmell.getNodeBasedCauses().forEach((n) => )
            })
            console.debug("groupSmells", groupSmells);
            let agroup = Analysed.getBuilder<joint.shapes.microtosca.Group>()
                                .setElement(group)
                                .setSmells(groupSmells)
                                .build();
            this.groupsWithSmells.push(agroup);
            // Derive node actions from the group smells (e.g., AddApiGateway in edge nodes)
            groupSmells.flatMap(groupSmell => [...groupSmell.getSubSmells()])?.forEach((memberSmell) => {
              this.groupMembersCausingSmells.push(
                Analysed.getBuilder<joint.shapes.microtosca.Node>()
                        .setElement(memberSmell[0])
                        .setSmells([memberSmell[1]])
                        .build()
              );
            })
          });*/
          return true;
        }),
        tap(_ => console.debug(`Send analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }
}