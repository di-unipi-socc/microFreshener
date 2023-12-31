import { Injectable } from '@angular/core';
import { g } from 'jointjs';
import { GraphInvoker } from 'src/app/commands/invoker';
import { GraphService } from 'src/app/graph/graph.service';
import { AddComputeCommand, RemoveComputeCommand } from './compute-commands';

@Injectable({
  providedIn: 'root'
})
export class ComputeService {

  computesVisible: boolean;

  constructor(
    private graphService: GraphService,
    private graphInvoker: GraphInvoker
  ) {
    this.computesVisible = false;
  }

  async addCompute(name: string, position?: g.Point) {
    let command = new AddComputeCommand(this.graphService.graph, name, position);
    return this.graphInvoker.executeCommand(command);
  }

  async deleteNode(node) {
    return this.graphInvoker.executeCommand(new RemoveComputeCommand(this.graphService.graph, node));
  }

  areComputesVisible() {
    return this.computesVisible;
  }

  showComputes() {
    this.computesVisible = true;
    this.graphService.graph.getComputes().forEach(compute => {
      compute.show();
    });
  }

  hideComputes() {
    this.computesVisible = false;
    this.graphService.graph.getComputes().forEach(compute => {
      compute.hide();
    });
  }

  isCompute(cell): boolean {
    return this.graphService.graph.isCompute(cell);
  }

}
