import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { GraphService } from '../graph/graph.service';

import { PrincipleRequest, SmellRequest } from './principles';

import { SmellFactoryService } from './smells/smell-factory.service';
import { GroupSmell, NodeSmell, Smell } from './smells/smell';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})

export class AnalyserService {

  private analysisUrl = environment.serverUrl + '/api/analyse';
  private smellsCount: number = 0;

  private analysisSubject: Subject<void> = new Subject<void>();
  private observableAnalysis: Observable<void> = this.analysisSubject.asObservable();

  constructor(
    private http: HttpClient,
    private gs: GraphService,
    private smellFactory: SmellFactoryService
  ) { }

  getSmellsCount(){
    return this.smellsCount;
  }
  
  showSmells() {
    this.gs.graph.getNodes().forEach((node) => { node.showSmells(); });
    this.gs.graph.getTeamGroups().forEach((group) => { group.showSmells(); });
  }

  // Remove the "smells" icons in the nodes and groups
  clearSmells() {
    this.smellsCount = 0;
    this.gs.graph.getNodes().forEach(node => { node.resetSmells(); });
    this.gs.graph.getTeamGroups().forEach(group => { group.resetSmells(); });
  }

  isSniffable(node): boolean {
    console.debug("isSniffable", node.isSniffable);
    if(node?.isSniffable) {
      return node.isSniffable();
    }
    return false;
  }

  getPrinciplesToAnalyse() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => (<PrincipleRequest[]>res.data));
  }

  runRemoteAnalysis(smells: SmellRequest[]): Observable<Boolean> {

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
              let edgeNodesSmells: GroupSmell[] = groupJson['smells'].flatMap((smellJson) => this.smellFactory.getGroupSmell(smellJson, group));
              edgeNodesSmells.forEach((smell) => smell.getNodeBasedCauses().forEach((node) => node.addSmell(smell)));
            } else {
              let groupSmells: GroupSmell[] = groupJson['smells'].map((smellJson) => this.smellFactory.getGroupSmell(smellJson, group));
              groupSmells.forEach((smell) => group.addSmell(smell));
            }
          });
          // Send the event that a new analysis has been done
          this.analysisSubject.next();
          return true;
        }),
        tap(_ => console.debug(`Sending analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }

  subscribe(observer) {
    return this.observableAnalysis.subscribe(observer);
  }

  findSmell(odorousName: string, smellName: string): Smell {
    let node = this.gs.graph.findNodeByName(odorousName);
    if(node) {
      return node.getSmells().find(smell => smell.getName() == smellName);
    }
  }

}