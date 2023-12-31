import { Injectable } from '@angular/core';
import { GraphService } from 'src/app/graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  constructor(
    private graphService: GraphService
  ) {}

  isEdgeGroup(node: joint.shapes.microtosca.Node): boolean {
    return this.graphService.graph.isEdgeGroup(node);
  }

}
