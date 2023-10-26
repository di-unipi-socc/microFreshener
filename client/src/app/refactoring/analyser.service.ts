import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';

import { ANode } from "./node";
import { AGroup } from "./group";

import { GraphService } from '../graph/graph.service';

import { Principle } from '../graph/model/principles';
import { Smell } from '../graph/model/smell';
import { SmellObject, GroupSmellObject, SingleLayerTeamsSmellObject, TightlyCoupledTeamsSmell } from './smell';
import { SMELL_NAMES } from "./costants";

import { WobblyServiceInteractionSmellObject, SharedPersistencySmellObject, EndpointBasedServiceInteractionSmellObject, NoApiGatewaySmellObject, MultipleServicesInOneContainerSmellObject } from "./smell";
import { CommunicationPattern } from "../graph/model/communicationpattern";
import { RefactoringFactoryService } from './refactoring-factory.service';
import { IgnoreOnceRefactoring, IgnoreAlwaysRefactoring } from './refactoring-commands/ignore-refactoring-commands';
import { Refactoring } from './refactoring-commands/refactoring-command';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AnalyserService {


  private analysisUrl = environment.serverUrl + '/api/analyse';
  
  analysednodes: ANode[] = [];   // list of analysed node;
  analysedgroups: AGroup[] = []; // list of analysed groups;

  constructor(private http: HttpClient, private gs: GraphService, private refactoringFactory: RefactoringFactoryService) { }

  getNumSmells(){
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
    this.analysednodes.forEach((anode) => {
      let n = this.gs.getGraph().getNode(anode.name);
      anode.getSmells().forEach((smell) => {
        n.addSmell(smell);
      })
    })

    this.analysedgroups.forEach((agroup) => {
      let g = this.gs.getGraph().getGroup(agroup.name);
      agroup.getSmells().forEach((smell) => {
        // in EdgeGroup the NoApiGateway smell is inseted in the node of the group
        smell.getNodeBasedCauses().forEach(node => {
          node.addSmell(smell);
        })
        g.addSmell(smell);
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

  getCommunicationPatterns() {
    return this.http.get<any>('assets/data/communicationpatterns.json')
      .toPromise()
      .then(res => <CommunicationPattern[]>res.data);
  }

  getPrinciplesToAnalyse() {
    return this.http.get<any>('assets/data/principles.json')
      .toPromise()
      .then(res => (<Principle[]>res.data)
      .filter(principle => principle.id != 1))
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
          // reset analysed node array
          this.analysednodes = [];
          // TODO: saved the analysed node ?? in order to have the history of the analysis.
          this.clearSmells(); 

          response['nodes'].forEach((node) => {
            var anode = this.buildAnalysedNodeFromJson(node);
            this.analysednodes.push(anode);
          });

          this.analysedgroups = [];
          response['groups'].forEach((group) => {
            let agroup = this.buildAnalysedGroupFromJson(group);
            this.analysedgroups.push(agroup);
          });
          return true;
        }),
        tap(_ => this.log(`Send analysis`),
        ),
        catchError((e: Response) => throwError(e))
      );
  }

  buildAnalysedGroupFromJson(data: Object) {
    var agroup: AGroup = new AGroup(data['name']);
    let group = this.gs.getGraph().getGroup(data['name']);
    data['smells'].forEach((smellJson) => {
      let smell: GroupSmellObject;
      switch (smellJson.name) {
        case SMELL_NAMES.SMELL_NO_API_GATEWAY:
          smell = new NoApiGatewaySmellObject(<joint.shapes.microtosca.EdgeGroup> group);
          break;
        case SMELL_NAMES.SMELL_SINGLE_LAYER_TEAMS:
          smell = new SingleLayerTeamsSmellObject(<joint.shapes.microtosca.SquadGroup> group);
          break;
        case SMELL_NAMES.SMELL_TIGHTLY_COUPLED_TEAMS:
          smell = new TightlyCoupledTeamsSmell(<joint.shapes.microtosca.SquadGroup> group);
          break;
        default:
          break;
      }
      smellJson['nodes'].forEach((node_name) => {
        let node = this.gs.getGraph().findNodeByName(node_name);
        smell.addNodeBasedCause(node);
      });
      
      smellJson['links'].forEach((link_cause) => {
        var source = this.gs.getGraph().findNodeByName(link_cause['source']);
        var target = this.gs.getGraph().findNodeByName(link_cause['target']);
        var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        console.log("source/target", source.getName(), target.getName());
        smell.addLinkBasedCause(link);
      });

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactorings: Refactoring[] = this.refactoringFactory.getRefactoring(refactoringName, smell);;
        refactorings.forEach(refactoring => smell.addRefactoring(refactoring));
      });
      this.addIgnoreOptions(group, smell);
      agroup.addSmell(smell);
    });
    console.log("agroup is", agroup);
    return agroup;
  }

  buildAnalysedNodeFromJson(data: Object) {
    var anode: ANode = new ANode(data['name']);

    data['smells'].forEach((smellJson) => {
      let smell: SmellObject;

      switch (smellJson.name) {
        case SMELL_NAMES.SMELL_ENDPOINT_BASED_SERVICE_INTERACTION:
          smell = new EndpointBasedServiceInteractionSmellObject();
          break;
        case SMELL_NAMES.SMELL_WOBBLY_SERVICE_INTERACTION_SMELL:
          smell = new WobblyServiceInteractionSmellObject();
          break;
        case SMELL_NAMES.SMELL_SHARED_PERSISTENCY:
          smell = new SharedPersistencySmellObject();
          break;
        case SMELL_NAMES.SMELL_MULTIPLE_SERVICES_IN_ONE_CONTAINER:
          smell = new MultipleServicesInOneContainerSmellObject();
        default:
          break;
      }

      smellJson['links'].forEach((cause) => {
        var source = this.gs.getGraph().findNodeByName(cause['source']);
        var target = this.gs.getGraph().findNodeByName(cause['target']);
        var link = this.gs.getGraph().getLinkFromSourceToTarget(source, target);
        smell.addLinkBasedCause(link);
        smell.addNodeBasedCause(this.gs.getGraph().findNodeByName(anode.name))
      });

      smellJson['refactorings'].forEach((refactoringJson) => {
        let refactoringName = refactoringJson['name'];
        let refactorings: Refactoring[] = this.refactoringFactory.getRefactoring(refactoringName, smell);
        refactorings.forEach((refactoring) => smell.addRefactoring(refactoring));
      });
      let node = this.gs.getGraph().findRootByName(anode.name);
      this.addIgnoreOptions(node, smell);
      anode.addSmell(smell);
    });
    return anode;
  }

  addIgnoreOptions(element, smell) {
    smell.addRefactoring(new IgnoreOnceRefactoring(element, smell));
    smell.addRefactoring(new IgnoreAlwaysRefactoring(element, smell));
  }

  /** Log a AnalyserService message with the MessageService */
  private log(message: string) {
  }
}