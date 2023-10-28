import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { GraphService } from '../graph/graph.service';

import { Principle } from '../graph/model/principles';
import { Smell } from '../graph/model/smell';

import { CommunicationPattern } from "../graph/model/communicationpattern";
import { SmellFactoryService } from './smell-factory.service';
import { Analysed } from './analysed';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AnalyserService {


  private analysisUrl = environment.serverUrl + '/api/analyse';
  
  analysednodes: Analysed<joint.shapes.microtosca.Node>[] = [];   // list of analysed node;
  analysedgroups: Analysed<joint.shapes.microtosca.Group>[] = []; // list of analysed groups;

  constructor(
    private http: HttpClient,
    private gs: GraphService,
    private smellFactory: SmellFactoryService
  ) { }

  getSmellsCount(){
    var num_smells = 0;
    this.analysednodes.forEach((anode)=> {
      num_smells +=  anode.getSmells().length;
    });
    this.analysedgroups.forEach((agroup)=> {
      num_smells +=  agroup.getSmells().length;
    });

    return num_smells
  }
  
  showSmells() {
    this.addAnalysedSmellsToNodes();
    this.addAnalysedSmellsToGroups();
  }

  private addAnalysedSmellsToNodes() {
    this.analysednodes.forEach((anode) => {
      let n = this.gs.getGraph().getNode(anode.getName());
      anode.getSmells().forEach((smell) => {
        n.addSmell(smell);
      })
    })
  }

  private addAnalysedSmellsToGroups() {
    this.analysedgroups.forEach((agroup) => {
      let g = this.gs.getGraph().getGroup(agroup.getName());
      agroup.getSmells().forEach((smell) => {
        // in EdgeGroup the NoApiGateway smell is inseted in the node of the group
        smell.getNodeBasedCauses().forEach(node => {
          node.addSmell(smell);
        });
        smell.getLinkBasedCauses().forEach(link => {
          let source = <joint.shapes.microtosca.Node> link.getSourceElement();
          source.addSmell(smell);
          let target = <joint.shapes.microtosca.Node> link.getTargetElement();
          target.addSmell(smell);
        });
        // g.addSmell(smell);
      })
    })
  }

  // Remove the "smells" icons in the nodes and groups
  clearSmells() {
    this.gs.getGraph().getNodes().forEach(node => {
      node.resetSmells();
    });
    this.gs.getGraph().getGroups().forEach(group => {
      console.log("group is", group);
      group.resetSmells();
    });
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

  runRemoteAnalysis(smells: Smell[] = null): Observable<Boolean> {

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

    // Maybe instead of a get is s POST operation.
    return this.http.get(this.analysisUrl, { params })
      .pipe(
        map((response: Response) => {
          console.log("analysis response", response);
          this.clearSmells(); 
          // reset analysed node array
          this.analysednodes = [];
          // TODO: saved the analysed node ?? in order to have the history of the analysis.
          response['nodes'].forEach((nodeJson) => {
            let node = this.gs.getGraph().findGroupByName(nodeJson['name']);
            let anode = Analysed.getBuilder<joint.shapes.microtosca.Node>()
                                .setName(nodeJson['name'])
                                .setSmells(nodeJson['smells'].map((smellJson) => this.smellFactory.getNodeSmell(smellJson, node)))
                                .setElement(node)
                                .build();
            this.analysednodes.push(anode);
          });

          this.analysedgroups = [];
          response['groups'].forEach((groupJson) => {
            let group = this.gs.getGraph().findGroupByName(groupJson['name']);
            let agroup = Analysed.getBuilder<joint.shapes.microtosca.Group>()
                                .setName(groupJson['name'])
                                .setSmells(groupJson['smells'].map((smellJson) => this.smellFactory.getGroupSmell(smellJson, group)))
                                .setElement(group)
                                .build();
            this.analysedgroups.push(agroup);
          });
          return true;
        }),
        tap(_ => this.log(`Send analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }

  /** Log a AnalyserService message with the MessageService */
  private log(message: string) {
  }
}