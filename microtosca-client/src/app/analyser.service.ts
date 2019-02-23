import { Injectable, asNativeElements } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { tap, map, catchError } from 'rxjs/operators';


import { ANode } from "./analyser/node";

import { GraphService } from './graph.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AnalyserService {

  private analysisUrl = 'http://127.0.0.1:8000/v2/graph/analyse/';  // URL to web api

  constructor(private http: HttpClient, private gs: GraphService) { }

  runRemoteAnalysis(principles: string[]): Observable<ANode[]> {
    const params = new HttpParams()
      .set('principles', principles.join()); // principles to be analysed: principles separated by commma

    return this.http.get(this.analysisUrl, { params })
      .pipe(
        map((response: Response) => {
          var data = response;
          let analysedNodes: ANode[] = [];
          data['nodes'].forEach((node) => {
            analysedNodes.push(ANode.fromJSON(node));
          });
          return analysedNodes;
        }),
        tap(_ => this.log(`Send analysis`),

        ),
        catchError((e: Response) => throwError(e))
      );
  }

  /** Log a AnalyserService message with the MessageService */
  private log(message: string) {
    console.log(`AnalyserService: ${message}`)
    // this.messageService.add(`HeroService: ${message}`);
  }
}
