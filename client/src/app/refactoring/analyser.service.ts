import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { GraphService } from '../graph/graph.service';

import { PrincipleRequest, SmellRequest } from './principles';

import { SmellFactoryService } from './smells/smell-factory.service';
import { Analysed } from './analysed';
import { GroupSmell } from './smells/smell';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})

export class AnalyserService {


  private analysisUrl = environment.serverUrl + '/api/analyse';

  constructor(
    private http: HttpClient,
    private gs: GraphService,
    private smellFactory: SmellFactoryService
  ) { }

  getSmellsCount(){
    var num_smells = 0;
    this.nodesWithSmells.forEach((anode)=> {
      num_smells +=  anode.getSmells().length;
    });
    this.groupsWithSmells.forEach((agroup)=> {
      num_smells +=  agroup.getSmells().length;
    });

    return num_smells
  }
  
  showSmells() {
    this.showNodeSmells();
    this.showGroupSmells();
  }

  private showNodeSmells() {
    this.nodesWithSmells.forEach((anode) => {
      let n = this.gs.graph.getNode(anode.getName());
      anode.getSmells().forEach((smell) => {
        n.addSmell(smell);
      })
    })
  }

  private showGroupSmells() {
    this.groupsWithSmells.forEach((agroup) => {
      let g = this.gs.graph.getGroup(agroup.getName());
      agroup.getSmells().forEach((smell) => {
          g.addSmell(smell);
      })
    })

    this.groupMembersCausingSmells.forEach((anode) => {
      let n = this.gs.graph.getNode(anode.getName());
      anode.getSmells().forEach((smell) => {
        n.addSmell(smell);
      })
    })
  }

  // Remove the "smells" icons in the nodes and groups
  clearSmells() {
    this.gs.graph.getNodes().forEach(node => {
      node.resetSmells();
    });
    this.gs.graph.getGroups().forEach(group => {
      group.resetSmells();
    });
  }

  getPrinciplesToAnalyse() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => (<PrincipleRequest[]>res.data)
      .filter(principle => principle.id != 1))
  }

  runRemoteAnalysis(smells: SmellRequest[]): Observable<Boolean> {

    this.clearSmells();

    let smells_ids: number[] = []; 
    smells_ids = smells.map(smell => smell.id);
    const params = new HttpParams().set('smells', smells_ids.join());

    // Maybe instead of a get this should be a POST operation
    return this.http.get(this.analysisUrl, { params })
      .pipe(
        map((response: Response) => {
          console.debug("Received analysis response", response);

          this.clearSmells(); 

          response['nodes'].forEach((nodeJson) => {
            let node = this.gs.graph.findNodeByName(nodeJson['name']);
            nodeJson['smells'].map((smellJson) => this.smellFactory.getNodeSmell(smellJson, node)).forEach((smell) => node.addSmell(smell));
          });

          response['groups'].forEach((groupJson) => {
            // Build the smells of the group
            let group = this.gs.graph.findGroupByName(groupJson['name']);
            if(this.gs.graph.isEdgeGroup(group)) {

            }
            let groupSmells: GroupSmell[] = groupJson['smells'].map((smellJson) => this.smellFactory.getGroupSmell(smellJson, group));
          });
          return true;
        }),
        tap(_ => console.debug(`Sending analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }

}