import { Injectable } from '@angular/core';
import { g } from 'jointjs';
import { GraphInvoker } from 'src/app/commands/invoker';
import { GraphService } from 'src/app/graph/graph.service';
import { AddComputeCommand, RemoveComputeCommand } from './compute-commands';

@Injectable({
  providedIn: 'root'
})
export class ComputeService {

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker
  ) { }

  async addCompute(name: string, position?: g.Point) {
    let command = new AddComputeCommand(this.graphService.graph, name, position);
    return this.graphInvoker.executeCommand(command);
  }

  async deleteNode(node) {
    return this.graphInvoker.executeCommand(new RemoveComputeCommand(this.graphService.graph, node));
  }

  showComputes() {
    this.graphService.graph.getComputes().forEach(compute => {
      compute.show();
    });
  }

  hideComputes() {
    this.graphService.graph.getComputes().forEach(compute => {
      compute.hide();
    });
  }

}
