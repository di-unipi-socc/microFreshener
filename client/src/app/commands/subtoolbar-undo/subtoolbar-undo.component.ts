import { Component } from '@angular/core';
import { GraphInvoker } from '../invoker';

@Component({
  selector: 'app-subtoolbar-undo',
  templateUrl: './subtoolbar-undo.component.html',
  styleUrls: ['./subtoolbar-undo.component.css']
})
export class SubtoolbarUndoComponent {

  constructor(private graphInvoker: GraphInvoker) {}

  undo() {
    this.graphInvoker.undo();
  }

  redo() {
    this.graphInvoker.redo();
  }

}
